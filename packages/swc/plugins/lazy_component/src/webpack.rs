use serde_json::Value;

const QUOTES: [char; 3] = ['"', '\'', '`'];

// webpack comment can contain js objects - [docs](https://webpack.js.org/api/module-methods/#magic-comments:~:text=This%20is%20wrapped%20in%20a%20JavaScript%20object%20and%20executed%20using%20node%20VM)
// and this method only handles base cases where key, values are strings without `,` inside
// but in should work in most cases
pub fn read_webpack_comment(comment: &str) -> Value {
    Value::Object(
        comment
            .split(',')
            .map(|v| v.trim())
            .filter_map(|item| {
                let s = item.split(':').map(|s| s.trim()).collect::<Vec<_>>();
                if s.len() == 2 {
                    let key = s[0].to_string();
                    let value = s[1].trim_matches(&QUOTES as &[char]);

                    let has_quotes = value.len() != s[1].len();

                    let value = if has_quotes {
                        Value::String(value.to_string())
                    } else {
                        match value {
                          "true" => Value::Bool(true),
                          "false" => Value::Bool(false),
                          "null" => Value::Null,
                          _ => panic!("Value `{}` in comment is not supported by @tramvai/swc-integration", value)
                        }
                    };

                    return Some((key, value));
                }

                None
            })
            .collect::<serde_json::Map<_, _>>(),
    )
}

pub fn generate_webpack_comment(values: serde_json::Value) -> String {
    let content = values
        .as_object()
        .unwrap()
        .iter()
        .map(|(k, v)| format!("{}: {}", k, v))
        .collect::<Vec<_>>()
        .join(", ");

    format!(" {content} ")
}

#[cfg(test)]
mod tests {

    mod read {
        use super::super::read_webpack_comment;
        use serde_json::json;

        #[test]
        fn single_value() {
            assert_eq!(
                read_webpack_comment(r#"webpackChunkName: 'name'"#),
                json!({ "webpackChunkName": "name" })
            );

            assert_eq!(
                read_webpack_comment(r#"webpackChunkName: "name""#),
                json!({ "webpackChunkName": "name" })
            );
        }

        #[test]
        fn many_values() {
            assert_eq!(
                read_webpack_comment(
                    r#"webpackChunkName: "name", webpackMode: "lazy", webpackPreload: true"#
                ),
                json!({ "webpackChunkName": "name", "webpackMode": "lazy", "webpackPreload": true })
            )
        }

        #[test]
        #[should_panic]
        fn unparsable_values() {
            read_webpack_comment(r#"webpackChunkName: "name", webpackInclude: /\.json$/"#);
        }
    }

    mod generate {
        use super::super::generate_webpack_comment;
        use serde_json::json;

        #[test]
        fn single_value() {
            assert_eq!(
                generate_webpack_comment(json!({ "webpackChunkName": "name" })),
                r#" webpackChunkName: "name" "#
            )
        }

        #[test]
        fn many_values() {
            assert_eq!(
                generate_webpack_comment(
                    json!({ "webpackChunkName": "name", "webpackMode": "lazy", "webpackPreload": true })
                ),
                r#" webpackChunkName: "name", webpackMode: "lazy", webpackPreload: true "#
            )
        }
    }
}
