import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import $ from 'jquery';
import TimeAgo from 'react-timeago';

const Heading = React.createClass({
    render: function(){
        const headingStyle= {
            backgroundColor: 'FloralWhite',
            fontSize: '19px'
        };
        return (<th style={headingStyle}>{this.props.heading}</th>);
    }
});

const Headings = React.createClass({
    render: function(){
        const headings = this.props.headings.map( (name, index) => {
            return (<Heading key={"heading-" + index} heading={name}></Heading>);
        });
        return (<tr className="">{headings}</tr>);
    }
});

const Row = React.createClass({
    render: function(){
        const trStyle = {backgroundColor: 'aliceblue'};
        return(<tr style={trStyle}>
            <td><TimeAgo date={this.props.changeSet.when}/></td>
            <td>{this.props.changeSet.who}</td>
            <td>{this.props.changeSet.description}</td>
        </tr>);
    }
});

const Rows = React.createClass({
    render: function(){
        const rows = this.props.changeSets.map((changeSet, index) => {
            return (<Row key={index} changeSet={changeSet}/>);
        });
        return (<tbody>{rows}</tbody>);
    }
});

let App = React.createClass({
    getInitialState: function(){
        return {changeSets: []}
    },
    mapOpenLibraryDataToChangeSet: function(data){
        return data.map( (change, index)=> {
            return {
                "when": change.timestamp,
                "who": change.author.key,
                "description": change.comment
            }
        });
    },
    componentDidMount: function(){
        $.ajax({
            url: 'http://openlibrary.org/recentchanges.json?limit=10',
            context: this,
            dataType: 'json',
            type: 'GET'
        }).done( (data) => {
            const changeSets = this.mapOpenLibraryDataToChangeSet(data);
            this.setState({changeSets: changeSets});
        });
    },
    render: function(){
        return (
            <table>
                <Headings headings={this.props.headings}/>
                <Rows changeSets={this.state.changeSets}/>
            </table>
        );
    }
});

const headings = ['Updated at', 'Author', 'Change']
ReactDOM.render(
  <App headings={headings}/>,
  document.getElementById('root')
);
