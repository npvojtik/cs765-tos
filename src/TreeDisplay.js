import { Component } from 'react';
import Tree from 'react-d3-tree';
import nodes from './data/data.json'

const getTreeToNodeHelper = (path, ind=0, rel=false) => {
	if (ind === path.length - 1) {
		return {
			name: path[ind].nodeName,
			nodeId: path[ind].nodeId,
			nodeSvgShape: {
				shape: 'circle',
				shapeProps: {
					r: 10,
					fill: rel ? 'blue' : 'red'
				}
			}
		};
	} else {
		return {
			name: path[ind].nodeName,
			nodeId: path[ind].nodeId,
			children: [getTreeToNodeHelper(path, ind+1, rel)]
		};
	}
}

const getTreeToNode = (nodeId, rel=false) => {
	const node = nodes[nodeId];
	return getTreeToNodeHelper(node.path, 0, rel);
}

const getTreeToNodes = (nodeId1, nodeId2) => {
	const path1 = getTreeToNode(nodeId1);

	if (nodeId1 === nodeId2) {
		return path1;
	}

	const path2 = getTreeToNode(nodeId2, true);

	let ptr1 = path1;
	let ptr2 = path2;

	// path1 is root
	if (ptr1.children === undefined) {
		ptr1.children = ptr2.children;
		return [path1];
	}

	// path2 is root
	if (ptr2.children === undefined) {
		ptr2.children = ptr1.children;
		return [path2];
	}

	let child1 = path1.children[0];
	let child2 = path2.children[0];

	while(child1["name"] === child2["name"]) {
		ptr1 = ptr1.children[0];
		ptr2 = ptr2.children[0];

		if (ptr2.children === undefined) {
			child1 = ptr1.children[0];
			ptr2.children = [child1];
			return [path2];
		}

		if (ptr1.children === undefined) {
			child2 = ptr2.children[0];
			ptr1.children = [child2];
			return [path1]
		}

		child1 = ptr1.children[0];
		child2 = ptr2.children[0];
	}

	ptr1.children.push(child2);
	
	return [path1];
}

class TreeDisplay extends Component {
	constructor(props) {
		super(props);
	}

	handleClick = (nodeData, evt) => {
		this.props.setSelectedNode(nodeData.nodeId);
	}

	render() {
		return(
			<Tree
				data={
					this.props.relNodeId === undefined 
					? getTreeToNode(this.props.selNodeId)
					: getTreeToNodes(this.props.selNodeId, this.props.relNodeId)
				}
				transitionDuration={0}
				collapsible={false}
				textLayout={{textAnchor: "middle", y: 30, transform: "scale(0.7, 1)"}}
				translate={{x: 30, y: 190}}
				onClick={this.handleClick}
			/>
		)
	}
}

export default TreeDisplay;
export { getTreeToNodes };