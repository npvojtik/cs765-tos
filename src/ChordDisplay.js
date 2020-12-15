import { Component } from 'react';
import ChordDiagram from 'react-chord-diagram';

import nodes from './data/data.json';

const getAlsoIntersection = (sel, rel) => {
	const selAlsoIds = Object.keys(sel.also);
	const relAlsoIds = Object.keys(rel.also);
	const overlapping = selAlsoIds.filter(item => relAlsoIds.includes(item));
	const withCounts = overlapping.map(item => {
		return ({
			[item]: rel.also[item]
		});
	});
	const sorted = withCounts.sort((a, b) => {
		if (Object.values(a)[0] < Object.values(b)[0]) {
			return 1;
		}
		if (Object.values(a)[0] > Object.values(b)[0]) {
			return -1;
		}
		return 0;
	});
	return sorted.slice(0,4).map(item => Object.keys(item)[0]);
}

const getMatrixNodes = (sel, rel) => {
	const alsoIntersection = getAlsoIntersection(sel, rel);
	const matrixNodes = [rel].concat(alsoIntersection.map(a => nodes[a]));
	return matrixNodes;
}

const createMatrix = (sel, rel) => {
	const matrixNodes = getMatrixNodes(sel, rel);
	const matrix = [];
	matrixNodes.forEach((item, outerInd) => matrix.push(
		
		matrixNodes.map((node, innerInd) => {
			if (outerInd === innerInd) {
				return 0;
			}
			if (item.also[node.id] === undefined) {
				return 0;
			}
			return item.also[node.id];
		})
	));
	return matrix;
}

const colors = ["#FFBA49", "#20A39E", "#EF5B5B", "#23001E", "#8C2155"];
const fontColors = ["#000000", "#000000", "#000000", "#FFFFFF", "#FFFFFF"];

class ChordDisplay extends Component {
	constructor(props) {
		super(props);
		this.state = {
			matrix: this.props.relNode !== undefined ? createMatrix(this.props.selNode, this.props.relNode) : undefined
		}
	}

	render() {
		const myMatrixNodes = this.props.relNode !== undefined ? getMatrixNodes(this.props.selNode, this.props.relNode) : undefined;
		const myMatrix = this.props.relNode !== undefined ? createMatrix(this.props.selNode, this.props.relNode) : undefined;
		const myColors = myMatrix !== undefined ? colors.slice(0, myMatrix.length) : undefined;
		const myFontColors = myMatrix !== undefined ? fontColors.slice(0, myMatrix.length) : undefined;
		const myLabels = myMatrix !== undefined ? myMatrix.map(row => row.reduce((acc, cur) => acc + cur, 0)) : undefined;
		return (
			<div style={{display: "flex", flexFlow: "column", justifyContent: "center", alignItem: "center",}}>
				{
					myMatrix !== undefined && myMatrixNodes.length > 1 &&
					<>
						<div style={{flex: 1}}>
							{
								myMatrixNodes.map((node, ind) => {
									return(
										<div key={node.id} 
											style={{
												padding: "5px", 
												backgroundColor: myColors[ind], 
												display: "inline-block", 
												fontWeight: "bold", 
												color: myFontColors[ind], 
												cursor: "pointer"}}
											onClick={() => this.props.setRelatedNode(node.id)}
										>
											{ node.name }
										</div>
									)
								})
							}
						</div>
						<ChordDiagram
							matrix={myMatrix}
							componentId={1}
							height={400}
							resizeWithWindow={true}
							groupLabels={myLabels}
							groupColors={myColors}
							groupOnClick={(ind) => this.props.setRelatedNode(myMatrixNodes[ind].id)}
							style={{flex: 1, marginTop: 20}}
						/>
					</>
				}
				{
					myMatrix !== undefined && myMatrixNodes.length === 1 &&
					<div style={{margin: "auto", padding: "10px"}}>
						This related category does not overlap with any other related category.
					</div>
				}
				{
					myMatrix === undefined &&
					<div style={{margin: "auto", padding: "10px"}}>
						Please select a related category.
					</div>
				}
			</div>
		);
	}
}

export default ChordDisplay;