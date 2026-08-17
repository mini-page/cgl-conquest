import sys, json
import networkx as nx
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from pathlib import Path

# Load using NetworkX node_link_graph (graph.json uses 'links' key)
graph_data = json.loads(Path('graphify-out/graph.json').read_text(encoding='utf-8'))
detection  = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8-sig'))

G = nx.node_link_graph(graph_data, edges='links')
print(f'Graph loaded: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges')

communities = cluster(G)
cohesion    = score_all(G, communities)
gods        = god_nodes(G)
surprises   = surprising_connections(G, communities)
labels      = {cid: f'Community {cid}' for cid in communities}
questions   = suggest_questions(G, communities, labels)
tokens      = {'input': 0, 'output': 0}

analysis = {
    'communities': {str(k): v for k, v in communities.items()},
    'cohesion':    {str(k): v for k, v in cohesion.items()},
    'gods':        gods,
    'surprises':   surprises,
    'questions':   questions,
}
Path('graphify-out/.graphify_analysis.json').write_text(
    json.dumps(analysis, indent=2, ensure_ascii=False), encoding='utf-8')

try:
    report = generate(
        G, communities, cohesion, labels, gods, surprises,
        detection, tokens,
        r'C:\Users\umang\Documents\ssc_cgl_dashboard',
        suggested_questions=questions
    )
    Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding='utf-8')
    print('GRAPH_REPORT.md written OK')
except Exception as e:
    print(f'Report generation error: {e}')
    # Minimal fallback
    lines = ['# CGL Conquest Knowledge Graph\n',
             f'{G.number_of_nodes()} nodes · {G.number_of_edges()} edges · {len(communities)} communities\n',
             '## God Nodes\n'] + [f'- **{g["label"]}** (degree {g["degree"]})' for g in gods[:10]] + [
             '\n## Surprising Connections\n'] + [f'- {s}' for s in surprises[:5]] + [
             '\n## Suggested Questions\n'] + [f'- {q}' for q in questions[:8]]
    Path('graphify-out/GRAPH_REPORT.md').write_text('\n'.join(lines), encoding='utf-8')
    print('Minimal GRAPH_REPORT.md written')

print(f'\nCommunities: {len(communities)}')
print(f'God nodes top 5: {[g["label"] for g in gods[:5]]}')
print(f'Questions: {questions[:3]}')
