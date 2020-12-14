import { Component, useState } from 'react';
import TreeDisplay from './TreeDisplay';
import SelectorDisplay from './SelectorDisplay';
import RelatedDisplay from './RelatedDisplay';
import ChordDisplay from './ChordDisplay';

import nodes from './data/data.json';


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selNodeId: 0,
			relNodeId: undefined
		}

		this.setSelectedNode = this.setSelectedNode.bind(this);
		this.setRelatedNode = this.setRelatedNode.bind(this);
	}

	setSelectedNode = (nodeId) => {
		this.setState({
			selNodeId: nodeId,
			relNodeId: undefined
		});
	}

	setRelatedNode = (nodeId) => {
		this.setState({
			relNodeId: nodeId
		});
	}

	render() {
		return (
			<>
			<div style={{display: "flex", flexDirection: "row", border: "1px solid gray", userSelect: "none"}}>
				<div style={{height: "400px", flex: 2}}>
					<TreeDisplay
						selNodeId={this.state.selNodeId}
						relNodeId={this.state.relNodeId}
						setSelectedNode={this.setSelectedNode}
					/>
				</div>
				<div style={{height: "400px", flex: 1}}>
					<SelectorDisplay
						selNode={nodes[this.state.selNodeId]}
						setSelectedNode={this.setSelectedNode}
					/>
				</div>
			</div>
			<div style={{display: "flex", flexDirection: "row", border: "1px solid gray", userSelect: "none"}}>
				<div style={{height: "400px", flex: 2}}>
					<RelatedDisplay
						selNode={nodes[this.state.selNodeId]}
						relNode={nodes[this.state.relNodeId]}
						setRelatedNode={this.setRelatedNode}
					/>
				</div>
				<div style={{height: "400px", flex: 1}}>
					<ChordDisplay
						selNode={nodes[this.state.selNodeId]}
						relNode={nodes[this.state.relNodeId]}
						setRelatedNode={this.setRelatedNode}
					/>
				</div>
			</div>
			</>
		);
	}
}

export default App;
