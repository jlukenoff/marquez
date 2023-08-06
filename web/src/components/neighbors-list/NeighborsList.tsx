// Copyright 2018-2023 contributors to the Marquez project
// SPDX-License-Identifier: Apache-2.0

import * as Redux from 'redux'
import { Box, Link, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import { IState } from '../../store/reducers'
import { Link as RouterLink } from 'react-router-dom'
import { addNodesToGraph, createDagreGraph } from '../../helpers/graph'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { determineLink, isJob } from '../../helpers/nodes'
import { setSelectedNode } from '../../store/actionCreators'
import { theme } from '../../helpers/theme'
import MqText from '../core/text/MqText'
import React from 'react'

interface StateProps {
  lineage: IState['lineage']
}

interface DispatchProps {
  setSelectedNode: typeof setSelectedNode
}

interface NeighborsListProps extends DispatchProps, StateProps {
  direction: 'upstream' | 'downstream'
}

const NeighborsList: React.FC<NeighborsListProps> = props => {
  const i18next = require('i18next')
  const { lineage, direction } = props
  if (!lineage.selectedNode) return null

  const graph = createDagreGraph()
  addNodesToGraph(graph, lineage.lineage.graph)

  const neighborNodes =
    direction === 'upstream'
      ? graph.predecessors(lineage.selectedNode)
      : graph.successors(lineage.selectedNode)

  if (!neighborNodes) return null

  return (
    <Box>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell align='left'>
              <MqText subheading inline>
                Type
              </MqText>
            </TableCell>
            <TableCell align='left'>
              <MqText subheading inline>
                Namespace
              </MqText>
            </TableCell>
            <TableCell align='left'>
              <MqText subheading inline>
                Name
              </MqText>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {neighborNodes.map(n => {
            const nodeId = (n as unknown) as string
            const node = graph.node(nodeId)
            const job = isJob(node)

            return (
              <TableRow key={nodeId}>
                <TableCell align='left'>
                  {job ? i18next.t('jobs.label_singular') : i18next.t('datasets.label_singular')}
                </TableCell>
                <TableCell align='left'>{node.data.namespace}</TableCell>
                <TableCell align='left'>
                  <Link
                    to={determineLink(node)}
                    onClick={() => props.setSelectedNode(nodeId)}
                    color='primary'
                    component={RouterLink}
                  >
                    {node.data.name}
                  </Link>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}

const mapDispatchToProps = (dispatch: Redux.Dispatch) =>
  bindActionCreators(
    {
      setSelectedNode: setSelectedNode
    },
    dispatch
  )

const mapStateToProps = (state: IState) => ({
  lineage: state.lineage
})

export default connect(mapStateToProps, mapDispatchToProps)(NeighborsList)
