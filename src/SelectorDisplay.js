import { Component } from 'react';
import SubcategoryIcon from './SubcategoryIcon';
import ProductIcon from './ProductIcon';

import nodes from './data/data.json';

class BreadCrumbs extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={{backgroundColor: "gray"}}>
				{
					this.props.selNode.path.map((prevNode, ind) => {
						const bgColor = ind === this.props.selNode.path.length - 1 ? "black": "white";
						const textColor = ind === this.props.selNode.path.length - 1 ? "white" : "black";
						return (
							<span 
								style={{
									border: "1px solid black", 
									padding: "5px", 
									cursor: "pointer", 
									display: "inline-block",
									backgroundColor: bgColor,
									color: textColor
								}}
								key={prevNode.nodeId}
								onClick={() => {
									this.props.setSelectedNode(prevNode.nodeId);
								}}
							>
								{prevNode.nodeName}
							</span>
						)
					})
				}
			</div>
		);
	}
}

class ChildrenCategories extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={{flexGrow: 1, overflow: "auto", backgroundColor: "gray"}}>
				{
					this.props.selNode.children.sort((a, b) => {
						const aName = nodes[a].name.toUpperCase();
						const bName = nodes[b].name.toUpperCase();
						if (aName < bName) {
							return -1;
						}
						if (aName > bName) {
							return 1;
						}
						return 0;
					}).map(childNodeId => {
						const childNode = nodes[childNodeId];
						return (
							<div 
								style={{border: "1px solid black", padding: "5px", display: "flex", flexDirection: "row", alignItems: "stretch", cursor: "pointer", backgroundColor: "white"}}
								key={childNodeId}
								onClick={() => {this.props.setSelectedNode(childNodeId)}}
							>
								<span style={{flex: 1}}>
									{ childNode.name }
								</span>
								<span style={{flex: 1, textAlign: "right"}}>
									<span>
										{ childNode.numChildren } 
									</span>
									<SubcategoryIcon /> 
									<span style={{paddingLeft: "10px"}}/>
									<span style={{minWidth: "30px", display: "inline-block"}}>
									{ childNode.prdCnt }
									</span> 
									<ProductIcon />
								</span>
							</div>
						)
					})
				}
			</div>
		);
	}
}

class SelectorDisplay extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={{display: "flex", flexFlow: "column", height: "100%"}}>
				<BreadCrumbs
					selNode={this.props.selNode}
					setSelectedNode={this.props.setSelectedNode}
				/>
				<ChildrenCategories
					selNode={this.props.selNode}
					setSelectedNode={this.props.setSelectedNode}
				/>
			</div>
		);
	}
}

export default SelectorDisplay;