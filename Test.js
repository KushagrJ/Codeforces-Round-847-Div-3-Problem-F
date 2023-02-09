
// https://www.youtube.com/watch?v=gda35eYXBJc
// https://towardsdatascience.com/network-graph-with-d3js-on-canvas-b90f275dfaa6

const n = 10;

const c = [1, 0, 7, 4, 9, 5, 8, 3, 2, 6];

const graph = {
    vertices: [
        {id: 0, color: "white", min_dist: n},
        {id: 1, color: "white", min_dist: n},
        {id: 2, color: "white", min_dist: n},
        {id: 3, color: "white", min_dist: n},
        {id: 4, color: "white", min_dist: n},
        {id: 5, color: "white", min_dist: n},
        {id: 6, color: "white", min_dist: n},
        {id: 7, color: "white", min_dist: n},
        {id: 8, color: "white", min_dist: n},
        {id: 9, color: "white", min_dist: n}
    ],
    edges: [
        {source: 9, target: 6},
        {source: 6, target: 7},
        {source: 2, target: 5},
        {source: 8, target: 6},
        {source: 6, target: 5},
        {source: 3, target: 1},
        {source: 0, target: 5},
        {source: 6, target: 4},
        {source: 8, target: 1}
    ]
};

let ans = n;

let ans_rect_color = "white";

let done = false;



// https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
// https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight

const width = window.innerWidth;
const height = window.innerHeight;

// https://github.com/d3/d3-selection#select

const canvas = d3.select("#canvas");

// https://github.com/d3/d3-selection#selection_attr

canvas.attr("width", width);
canvas.attr("height", height);

const ctx = canvas.node().getContext("2d");
const radius = 20;

function draw()
{
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.fillStyle = ans_rect_color;
    ctx.fillRect(5, 0, 100, 40);

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.font = "24px sans-serif";
    ctx.fillText("ans: " + ans, 5, 25);

    if (done)
    {
        ctx.beginPath();
        ctx.fillText("done", 5, 50);
    }

    graph.vertices.forEach(draw_vertex);
    graph.edges.forEach(draw_edge);
}

function draw_vertex(vertex)
{
    ctx.beginPath();
    ctx.fillStyle = vertex.color;
    ctx.strokeStyle = "black";
    ctx.arc(vertex.x, vertex.y, radius, 0, (2 * Math.PI));
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.font = "24px sans-serif";
    ctx.fillText(vertex.min_dist, (vertex.x + radius + 5), vertex.y);
}

// https://math.stackexchange.com/questions/175896/finding-a-point-along-a-line-a-certain-distance-away-from-another-point

function draw_edge(edge)
{
    ctx.beginPath();

    const x0 = edge.source.x, y0 = edge.source.y;
    const x1 = edge.target.x, y1 = edge.target.y;
    const d = Math.sqrt(((x1 - x0) ** 2) + ((y1 - y0) ** 2));
    const t = (radius / d);

    ctx.moveTo(((1 - t) * x0) + (t * x1), ((1 - t) * y0) + (t * y1));
    ctx.lineTo(((1 - t) * x1) + (t * x0), ((1 - t) * y1) + (t * y0));

    // ctx.moveTo(x0, y0);
    // ctx.lineTo(x1, y1);

    ctx.stroke();
}

// Copied from https://gist.github.com/mbostock/ad70335eeef6d167bc36fd3c04378048

canvas.call(d3.drag()
                .container(canvas.node())
                .subject(dragsubject)
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

// Copied from https://gist.github.com/mbostock/ad70335eeef6d167bc36fd3c04378048

function dragsubject()
{
    return simulation.find(d3.event.x, d3.event.y);
}

// Copied from https://gist.github.com/mbostock/ad70335eeef6d167bc36fd3c04378048

function dragstarted()
{
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
}

// Copied from https://gist.github.com/mbostock/ad70335eeef6d167bc36fd3c04378048

function dragged()
{
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
}

// Copied from https://gist.github.com/mbostock/ad70335eeef6d167bc36fd3c04378048

function dragended()
{
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
}

const simulation = d3.forceSimulation(graph.vertices)
                       .force("link", d3.forceLink().links(graph.edges))
                       .force("charge", d3.forceManyBody().strength(-(radius * 100)))
                       .force("center", d3.forceCenter((width / 2), (height / 2)))
                       // .alphaDecay(0)
                       .on("tick", draw);

// https://stackoverflow.com/a/52357953

function sleep()
{
    return new Promise(resolve => setTimeout(resolve, 2000));
}



const adj = new Array(n);

for (let i = 0; i < n; ++i)
    adj[i] = new Array();

// The simulation probably links the edges' sources and targets to the actual
// vertex objects, thereby requiring graph.edges[i].source.id to get the vertex
// number, instead of only graph.edges[i].source

for (let i = 0; i < (n - 1); ++i)
{
    adj[graph.edges[i].source.id].push(graph.edges[i].target.id);
    adj[graph.edges[i].target.id].push(graph.edges[i].source.id);
}

async function solve()
{
    for (let i = 0; i < n; ++i)
    {
        await sleep();
        graph.vertices[c[i]].color = "black";
        draw();

        await sleep();
        graph.vertices[c[i]].min_dist = 0;
        draw();

        await dfs(c[i], -1);
    }

    done = true;
    draw();
}

async function dfs(vertex, parent)
{
    if (graph.vertices[vertex].min_dist >= ans)
    {
        let color = graph.vertices[vertex].color;

        await sleep();
        graph.vertices[vertex].color = "red";
        draw();

        await sleep();
        graph.vertices[vertex].color = color;
        draw();

        return;
    }

    for (let i = 0; i < adj[vertex].length; ++i)
    {
        let child = adj[vertex][i];

        if (child === parent)
            continue;

        let color = graph.vertices[child].color;

        await sleep();
        graph.vertices[child].color = "green";
        draw();

        if (graph.vertices[child].min_dist > (graph.vertices[vertex].min_dist + 1))
        {
            await sleep();
            graph.vertices[child].min_dist = (graph.vertices[vertex].min_dist + 1);
            draw();

            await dfs(child, vertex);
        }

        else
        {
            if (ans > (graph.vertices[vertex].min_dist + graph.vertices[child].min_dist + 1))
            {
                await sleep();
                ans_rect_color = "black";
                draw();

                await sleep();
                ans = (graph.vertices[vertex].min_dist + graph.vertices[child].min_dist + 1);
                draw();

                await sleep();
                ans_rect_color = "white";
                draw();
            }
        }

        await sleep();
        graph.vertices[child].color = color;
        draw();
    }
}

solve();
