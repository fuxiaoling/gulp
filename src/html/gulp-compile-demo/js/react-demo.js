'use strict';

var React = require('react');
var mod = React.createClass({
    displayName: 'mod',

    render: function render() {
        return React.createElement(
            'div',
            null,
            ' hello from mod.jsx '
        );
    }
});
module.exports = mod;