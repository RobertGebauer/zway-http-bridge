function HTTPBridge(id, controller) {
    HTTPBridge.super_.call(this, id, controller);

    this.devicesToTrack = [];
    this.url = "";
}

inherits(HTTPBridge, AutomationModule);

_module = HTTPBridge;

HTTPBridge.prototype.init = function (config) {
    HTTPBridge.super_.prototype.init.call(this, config);

    var self = this;

    this.devicesToTrack = config.devicesToTrack;
    this.url = config.url;

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
            url: self.url,
            method: "POST",
            async: true,
            headers: {
                "Content-Type": "application/json"
            },
            data: publishItemString
        });

    };

    this.devicesToTrack.forEach(function (device) {
        self.controller.devices.on(device, 'change:metrics:level', self.handler);
    });
};

HTTPBridge.prototype.stop = function () {
    HTTPBridge.super_.prototype.stop.call(this);
    var self = this;

    this.devicesToTrack.forEach(function (device) {
        self.controller.devices.off(device, 'change:metrics:level', self.handler);
    });
};
