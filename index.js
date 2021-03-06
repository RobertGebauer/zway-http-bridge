function HTTPBridge(id, controller) {
    HTTPBridge.super_.call(this, id, controller);
    this.devicesToTrack = [];
}

inherits(HTTPBridge, BaseModule);
_module = HTTPBridge;

HTTPBridge.prototype.init = function (config) {
    HTTPBridge.super_.prototype.init.call(this, config);

    this.devicesToTrack = config.devicesToTrack;

    this.handler = function (vDev) {
        var level = vDev.get("metrics:level");
        var id = vDev.get("id");
        var type = vDev.get("deviceType");
        var name = vDev.get("name");
        var metrics = vDev.get("metrics");

        var publishItem = {
            timestamp: new Date().getTime(),
            level: level,
            id: id,
            type: type,
            name: name,
            metrics: metrics
        };

        var publishItemString = JSON.stringify(publishItem);

        http.request({
            url: config.url,
            method: "POST",
            async: true,
            headers: {
                "Content-Type": "application/json"
            },
            data: publishItemString
        });

    };

    this.devicesToTrack.forEach(_.bind(function (device) {
        this.controller.devices.on(device, 'modify:metrics:level', this.handler);
    }, this));
};

HTTPBridge.prototype.stop = function () {
    HTTPBridge.super_.prototype.stop.call(this);

    this.devicesToTrack.forEach(_.bind(function (device) {
        this.controller.devices.off(device, 'modify:metrics:level', this.handler);
    }, this));
};
