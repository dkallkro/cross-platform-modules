﻿import common = require("ui/date-picker/date-picker-common");
import dependencyObservable = require("ui/core/dependency-observable");
import proxy = require("ui/core/proxy");

function onYearPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var picker = <DatePicker>data.object;

    if (picker.android && picker.android.getYear() !== data.newValue) {
        picker.android.updateDate(data.newValue, picker.android.getMonth(), picker.android.getDayOfMonth());
    }
}

(<proxy.PropertyMetadata>common.DatePicker.yearProperty.metadata).onSetNativeValue = onYearPropertyChanged;

function onMonthPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var picker = <DatePicker>data.object;

    if (picker.android && picker.android.getMonth() !== (data.newValue - 1)) {
        picker.android.updateDate(picker.android.getYear(), data.newValue - 1, picker.android.getDayOfMonth());
    }
}

(<proxy.PropertyMetadata>common.DatePicker.monthProperty.metadata).onSetNativeValue = onMonthPropertyChanged;

function onDayPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var picker = <DatePicker>data.object;

    if (picker.android && picker.android.getDayOfMonth !== data.newValue) {
        picker.android.updateDate(picker.android.getYear(), picker.android.getMonth(), data.newValue);
    }
}

(<proxy.PropertyMetadata>common.DatePicker.dayProperty.metadata).onSetNativeValue = onDayPropertyChanged;

// merge the exports of the common file with the exports of this file
declare var exports;
require("utils/module-merge").merge(common, exports);

export class DatePicker extends common.DatePicker {
    private _android: android.widget.DatePicker;
    public _listener: android.widget.DatePicker.OnDateChangedListener;

    get android(): android.widget.DatePicker {
        return this._android;
    }

    constructor() {
        super();

        var that = new WeakRef(this);

        this._listener = new android.widget.DatePicker.OnDateChangedListener({
            get owner() {
                return that.get();
            },

            onDateChanged: function (picker: android.widget.DatePicker, year: number, month: number, day: number) {
                if (this.owner) {

                    if (year !== this.owner.year) {
                        this.owner._onPropertyChangedFromNative(common.DatePicker.yearProperty, year);
                    }

                    if ((month + 1) !== this.owner.month) {
                        this.owner._onPropertyChangedFromNative(common.DatePicker.monthProperty, month + 1);
                    }

                    if (day !== this.owner.day) {
                        this.owner._onPropertyChangedFromNative(common.DatePicker.dayProperty, day);
                    }                    
                }
            }
        });
    }

    public _createUI() {
        this._android = new android.widget.DatePicker(this._context);
        this._android.setCalendarViewShown(false);
        this._android.init(0, 0, 0, this._listener);
    }
} 