import { Component } from 'react';
import { getTreeToNodes } from './TreeDisplay';

import nodes from './data/data.json';

const getDistanceBetweenNodes = (nodeId1, nodeId2) => {
	if (nodeId1 === nodeId2) {
		return 0;
	}

	const tree = getTreeToNodes(nodeId1, nodeId2);

	let branch = tree[0];
	
	// tree is just the root
	if (branch.name === "root" && branch.children === undefined) {
		return 0;
	}
	
	let onSameBranch = false;
	let onSameBranchCnt = 1;

	// iterate until there is more than one child; this is the branching point
	while (branch.children !== undefined && branch.children.length < 2) {
		if (onSameBranch) {
			onSameBranchCnt += 1;
		}
		if (branch.nodeId === nodeId1 || branch.nodeId === nodeId2) {
			onSameBranch = true;
		}
		branch = branch.children[0];
	}

	if (onSameBranch) {
		return onSameBranchCnt;
	}

	// count left children until there are no more
	let leftCnt = 1;
	let leftChild = branch.children[0];

	while (leftChild.children !== undefined) {
		leftCnt += 1;
		leftChild = leftChild.children[0];
	}

	// count right children until there are no more
	let rightCnt = 1;
	let rightChild = branch.children[1];

	while (rightChild.children !== undefined) {
		rightCnt += 1;
		rightChild = rightChild.children[0];
	}

	return(leftCnt + rightCnt);
}

class RelatedDisplay extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sortFunction: this.sortByCategory,
			keyword: "category"
		}

		this.setSortFunction = this.setSortFunction.bind(this);
	}

	sortByCategory = (a, b) => {
		const aName = nodes[a].name.toUpperCase();
		const bName = nodes[b].name.toUpperCase();
		if (aName < bName) {
			return -1;
		}
		if (aName > bName) {
			return 1;
		}
		// if we reach here, they are equal and we should break ties with
		// the path
		const aPathString = nodes[a].path.slice(1, nodes[a].path.length - 1)
			.map(pathNode => pathNode.nodeName)
			.join(" > ") + " >";
		const bPathString = nodes[b].path.slice(1, nodes[b].path.length - 1)
			.map(pathNode => pathNode.nodeName)
			.join(" > ") + " >";
		if (aPathString < bPathString) {
			return -1;
		}
		if (aPathString > bPathString) {
			return 1;
		}
		// truly the same
		return 0;
	}

	sortByOverlap = (a, b) => {
		const aOverlap = this.props.selNode.also[a];
		const bOverlap = this.props.selNode.also[b];

		if (aOverlap < bOverlap) {
			return -1;
		}
		if (aOverlap > bOverlap) {
			return 1;
		}
		return 0;
	}

	revSortByOverlap = (a, b) => {
		return -1 * (this.sortByOverlap(a, b));
	}

	sortByPrdCnt = (a, b) => {
		const aPrdCnt = nodes[a].subPrdCnt;
		const bPrdCnt = nodes[b].subPrdCnt;

		if (aPrdCnt < bPrdCnt) {
			return -1;
		}
		if (aPrdCnt > bPrdCnt) {
			return 1;
		}
		return 0;
	}

	revSortByPrdCnt = (a, b) => {
		return -1 * this.sortByPrdCnt(a, b);
	}

	sortByDistance = (a, b) => {
		const aDist = getDistanceBetweenNodes(this.props.selNode.id, a);
		const bDist = getDistanceBetweenNodes(this.props.selNode.id, b);

		if (aDist < bDist) {
			return -1;
		}
		if (aDist > bDist) {
			return 1;
		}
		return 0;
	}
	
	revSortByDistance = (a, b) => {
		return -1 * this.sortByDistance(a, b);
	}

	revSortByCategory = (a, b) => {
		return -1 * this.sortByCategory(a, b);
	}

	setSortFunction = (keyword) => {
		console.log("keyword");
		const curKeyword = this.state.keyword;
		// we're going in reverse order
		if (curKeyword === keyword) {
			if (keyword === "category") {
				this.setState({
					sortFunction: this.revSortByCategory,
					keyword: keyword.split("").reverse().join("")
				});
			}
			if (keyword === "overlap") {
				this.setState({
					sortFunction: this.revSortByOverlap,
					keyword: keyword.split("").reverse().join("")
				});
			}
			if (keyword === "prdcnt") {
				this.setState({
					sortFunction: this.revSortByPrdCnt,
					keyword: keyword.split("").reverse().join("")
				});
			}
			if (keyword === "distance") {
				this.setState({
					sortFunction: this.revSortByDistance,
					keyword: keyword.split("").reverse().join("")
				})
			}
			return;
		}
		if (keyword === "category") {
			this.setState({
				sortFunction: this.sortByCategory,
				keyword: keyword
			});
		}
		if (keyword === "overlap") {
			this.setState({
				sortFunction: this.sortByOverlap,
				keyword: keyword
			});
		}
		if (keyword === "prdcnt") {
			this.setState({
				sortFunction: this.sortByPrdCnt,
				keyword: keyword
			});
		}
		if (keyword === "distance") {
			this.setState({
				sortFunction: this.sortByDistance,
				keyword: keyword
			});
		}
	}

	render() {
		const alsoEntries = Object.keys(this.props.selNode.also).sort(this.state.sortFunction);

		return (
			<>
			<div style={{display: "flex", flexFlow: "column", height: "100%"}}>
				<div style={{border: "1px solid black", padding: "5px", paddingRight: "20px", textAlign: "center", backgroundColor: "#43464B", color: "white"}}>
					<div style={{width: "40%", display: "inline-block", cursor: "pointer"}} onClick={() => this.setSortFunction("category")}>Related Category</div>
					<div style={{width: "15%", display: "inline-block", cursor: "pointer"}} onClick={() => this.setSortFunction("overlap")}>Overlap</div>
					<div style={{width: "30%", display: "inline-block", cursor: "pointer"}} onClick={() => this.setSortFunction("prdcnt")}>Products</div>
					<div style={{width: "15%", display: "inline-block", cursor: "pointer"}} onClick={() => this.setSortFunction("distance")}>Distance</div>
				</div>
				<div style={{flexGrow: 1, overflow: "auto", width: "100%"}}>
					{
						alsoEntries.map(alsoNodeId => {
							const alsoNode = nodes[alsoNodeId];
							const pathString = alsoNode.path.slice(1, alsoNode.path.length - 1)
								.map(pathNode => pathNode.nodeName)
								.join(" > ") + " >";

							let backgroundColor = "white";
							let color = "black";

							if (this.props.relNode !== undefined) {
								if (this.props.relNode.id == alsoNodeId) {
									backgroundColor = "black";
									color = "white";
								}
							}

							return (
								<div style={{border: "1px solid black", padding: "5px", cursor: "pointer", backgroundColor: backgroundColor, color: color}}
									onClick={() => this.props.setRelatedNode(alsoNodeId)}
									key={alsoNodeId}
								>
									<div style={{width: "40%", display: "inline-block"}}>
										<div style={{color: "gray", fontSize: "12px", display: "inline-block"}}>
											{pathString}
										</div>
										<div>
											{alsoNode.name}
										</div>
									</div>
									<div style={{width: "15%", display: "inline-block", textAlign: "center"}}>
										{this.props.selNode.also[alsoNodeId]}
									</div>
									<div style={{width: "30%", display: "inline-block", textAlign: "center"}}>
										<div style={{display: "inline-block", height: "12px", backgroundColor: "green", width: `${Math.round((alsoNode.prdCnt / (alsoNode.subPrdCnt)) * 100)}%`}}></div>
										<div style={{display: "inline-block", height: "12px", backgroundColor: "red", width: `${Math.round(((alsoNode.subPrdCnt - alsoNode.prdCnt) / (alsoNode.subPrdCnt)) * 100)}%`}}></div>
										<div>
											{alsoNode.subPrdCnt} (<span style={{color: 'green'}}>{alsoNode.prdCnt}</span> / <span style={{color: 'red'}}>{alsoNode.subPrdCnt - alsoNode.prdCnt}</span>)
										</div>
									</div>
									<div style={{width: "15%", display: "inline-block", textAlign: "center"}}>
										{getDistanceBetweenNodes(this.props.selNode.id, alsoNodeId)}
									</div>
								</div>
							)
						})
					}
				</div>
			</div>
			</>
		);
	}
}

export default RelatedDisplay;