import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { connect } from 'react-redux';

import Printing from './Printing';
import Laser from './Laser';
import CNC from './CNC';
import {
    MACHINE_HEAD_TYPE
} from '../../constants';
import { actions as widgetActions } from '../../flux/widget';


class MarlinWidget extends PureComponent {
    static propTypes = {
        setTitle: PropTypes.func.isRequired,
        setDisplay: PropTypes.func.isRequired,

        headType: PropTypes.string,
        isConnected: PropTypes.bool
    };

    actions = {
        setTitle: (headType) => {
            let title = 'Detecting...';
            headType === MACHINE_HEAD_TYPE['3DP'].value && (title = '3D Printer');
            headType === MACHINE_HEAD_TYPE.LASER.value && (title = 'Laser');
            (headType === MACHINE_HEAD_TYPE.CNC.value) && (title = 'CNC');
            this.props.setTitle(title);
        }
    };

    componentDidMount() {
        const { isConnected, headType } = this.props;
        if (isConnected) {
            this.props.setDisplay(true);
        } else {
            this.props.setDisplay(false);
        }
        this.actions.setTitle(headType);
    }

    componentWillReceiveProps(nextProps) {
        const { isConnected, headType } = nextProps;
        if (isConnected && !this.props.isConnected) {
            this.props.setDisplay(true);
        }
        if (!isConnected) {
            this.props.setDisplay(false);
        }
        if (headType !== this.props.headType) {
            this.actions.setTitle(headType);
        }
    }


    render() {
        const { headType } = this.props;
        return (
            <div>
                {headType === MACHINE_HEAD_TYPE['3DP'].value && <Printing />}
                {headType === MACHINE_HEAD_TYPE.LASER.value && <Laser />}
                {headType === MACHINE_HEAD_TYPE.CNC.value && <CNC />}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { headType, isConnected } = state.machine;


    return {
        isConnected,
        headType
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateWidgetState: (value) => dispatch(widgetActions.updateWidgetState(ownProps.widgetId, '', value))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(MarlinWidget);
