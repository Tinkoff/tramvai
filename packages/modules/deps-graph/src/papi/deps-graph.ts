import { createPapiMethod } from '@tramvai/papi';
import type { DI_TOKEN } from '@tinkoff/dippy';
import { getGraph } from '../utils/get-graph';

interface Deps {
  di: typeof DI_TOKEN;
}

export const depsGraph = ({ di }: Deps) => {
  return createPapiMethod({
    method: 'get',
    path: '/deps-graph',
    async handler(req, res) {
      const graphs = getGraph({ di, searchValue: (req.query.search as string) ?? '' });

      function isLineVisible(line, graph) {
        return (
          (!req.query.lines && graph) || ((req.query.lines ?? '') as string).search(line) !== -1
        );
      }

      res.send(`
<script src="//d3js.org/d3.v6.min.js"></script>
<script src="https://unpkg.com/@hpcc-js/wasm@1.4.1/dist/index.min.js"></script>
<script src="https://unpkg.com/d3-graphviz@4.0.0/build/d3-graphviz.js"></script>

<div style="cursor: pointer; text-align: center; background: rgba(170,170,170,.7); position: fixed; right: 10px; top: 10px; width: 30px; height: 30px; font-size: 20px;" onClick="backToTop()">
  🠕
</div>

<h3>Search:</h3>
<input placeholder="Search module and token names..." value="${
        req.query.search || ''
      }" style="padding: 10px 4px; width: 450px" onkeyup="event.keyCode === 13 && applySearch(this.value)" onblur="applySearch(this.value)"/><br/>

<h3>Command Lines:</h3>
${graphs
  .map(
    ([token, graph]) => `
  <input id="${token}" type="checkbox" ${
      ((req.query.lines ?? '') as string).search(token) !== -1 ? 'checked' : ''
    } onchange="toggleLine('${token}')"/><label ${
      !graph ? 'style="color: gray"' : ''
    } for="${token}">${token}</label>
`
  )
  .join('<br/>')}


<h3>Graphs:</h3>
${graphs
  .map(
    ([token, graph]) => `
<section style="display: ${isLineVisible(token, graph) ? 'block' : 'none'}">
  <h3>${token}</h3>
  <div id="${token}_graph"></div>
  <hr style="margin: 15px 0;"/>
</section>
`
  )
  .join('')}
<script>
  window.toggleLine = function(line) {
    const searchParams = new URLSearchParams(location.search)
    const lines = searchParams.get('lines')
    let selected = lines ? lines.split(',') : []
    if (selected.indexOf(line) !== -1) {
      selected.splice(selected.indexOf(line), 1)
    } else {
      selected = selected.concat(line)
    }

    searchParams.set('lines', selected.join(','))
    location.search = searchParams.toString()
  }

  window.applySearch = function(search) {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set('search', search)
    location.search = searchParams.toString()
  }

  const searchParams = new URLSearchParams(location.search)
  const selectedLines = searchParams.get('lines')
  const graphs = ${JSON.stringify(graphs)}
  const renderedGraphs = graphs
    .filter(([token]) => {
      return !selectedLines || selectedLines.split(',').find(t => t === token)
    })

  window.backToTop = function() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    })

    renderedGraphs
      .forEach(([token]) => {
        d3.select('#' + token + '_graph')
          .graphviz()
            .resetZoom(500);
      })
  }

  renderedGraphs
    .forEach(([token, graph]) => {
      d3.select('#' + token + '_graph')
        .graphviz()
          .renderDot(graph);
    })
</script>
`);
    },
  });
};
