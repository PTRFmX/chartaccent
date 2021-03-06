import * as React from "react";
import { NavigationView } from "./navigationView";
import { ControlsTestView } from "./controlsTestView";
import { LoadDataView } from "./loadDataView";
import { ReviewDataView } from "./reviewDataView";
import { ChartTypeView, CreateChartView } from "./createChartView";
import { ChartView } from "../charts/chartView";
import { ExportView } from "./exportView";

import * as Actions from "../store/actions";
import { MainStore } from "../store/store";
import { EventSubscription } from "fbemitter";

import { Button } from "../controls/controls";

import { Dataset, Chart } from "../model/model";

export interface IMainViewProps {
    store: MainStore;
}

export interface IMainViewState {
    dataset?: Dataset;
    chart?: Chart;
}

export class MainView extends React.Component<IMainViewProps, IMainViewState> {
    private _subscriptions: EventSubscription[] = [];

    constructor(props: IMainViewProps) {
        super(props);

        this.state = {
            dataset: null,
            chart: null
        };
    }

    public componentDidMount() {
        this._subscriptions.push(this.props.store.addDatasetChangedListener(this.onDatasetChanged.bind(this)));
        this._subscriptions.push(this.props.store.addChartChangedListener(this.onChartChanged.bind(this)));
    }

    public componentWillUnmount() {
        for(let sub of this._subscriptions) {
            sub.remove();
        }
    }

    public onDatasetChanged() {
        this.setState({
            dataset: this.props.store.dataset
        });
    }

    public onChartChanged() {
        this.setState({
            chart: this.props.store.chart
        });
    }
    public render() {
        return (
            <div className="wrapper">
                <div className="menu-wrapper">
                    <NavigationView store={this.props.store} />
                </div>
                <div className="main-wrapper">
                    <LoadDataView store={this.props.store} dataset={this.state.dataset} />
                    { this.state.dataset != null && this.state.chart != null ? <ChartTypeView chart={this.state.chart} /> : null }
                    { this.state.dataset != null && this.state.chart != null ? <CreateChartView chart={this.state.chart} store={this.props.store} /> : null }
                    { this.state.dataset != null && this.state.chart != null && this.state.chart.type != null ? <ExportView store={this.props.store} /> : null }
                </div>
            </div>
        );
    }
}