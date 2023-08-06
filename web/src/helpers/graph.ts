// Copyright 2018-2023 contributors to the Marquez project
// SPDX-License-Identifier: Apache-2.0

import { LineageNode, MqNode } from '../components/lineage/types'
import { graphlib } from 'dagre'

export const NODE_SIZE = 0

export const DAGRE_CONFIG = {
  rankdir: 'LR',
  marginx: 140,
  marginy: 40,
  align: 'UL',
  ranker: 'network-simplex',
  edgesep: 60,
  ranksep: 140
}

export const createDagreGraph = () => {
  const g = new graphlib.Graph<MqNode>({ directed: true })
  g.setGraph(DAGRE_CONFIG)
  g.setDefaultEdgeLabel(() => ({}))
  return g
}

export const addNodesToGraph = (graph: graphlib.Graph<MqNode>, nodes: LineageNode[]) => {
  nodes.forEach(node => {
    graph.setNode(node.id, {
      label: node.id,
      data: node.data,
      width: NODE_SIZE,
      height: NODE_SIZE
    })

    node.inEdges.forEach(n => {
      graph.setEdge(n.origin, node.id)
    })
  })
}
