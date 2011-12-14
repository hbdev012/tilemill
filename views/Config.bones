view = Backbone.View.extend();

view.prototype.events = {
    'click input[type=submit]': 'save',
    'click a[href=#oauth]': 'oauth',
    'click a[href=#disable]': 'disable'
};

view.prototype.initialize = function(options) {
    _(this).bindAll('render', 'bufferSize', 'oauth', 'disable', 'save');
    this.render();
};

view.prototype.render = function() {
    $('.bleed .active').removeClass('active');
    $('.bleed .settings').addClass('active');
    this.el.html(templates.Config(this.model));
    this.$('.slider').slider({
        min:0,
        max:1024,
        value: this.model.get('bufferSize'),
        step:16,
        slide: this.bufferSize
    });
    return this;
};

view.prototype.bufferSize = function(ev, ui) {
    this.$('.bufferSize').text(ui.value);
};

view.prototype.oauth = function(ev) {
    this.el.html('<iframe class="oauth" width="700" height="300" scrolling="no" src="/oauth/mapbox"></iframe>');
    window.onmessage = _(function(msg) {
        this.model.fetch({
            success:this.render,
            error:this.render
        });
    }).bind(this);
    return false;
};

view.prototype.disable = function(ev) {
    this.model.set({
        'syncAccount': '',
        'syncAccessToken': ''
    });
    this.$('.syncOn').addClass('dependent');
    this.$('.syncOff').removeClass('dependent');
    return false;
};

view.prototype.save = function() {
    var attr = {
        'files': this.$('input[name=files]').val(),
        'bufferSize': parseInt(this.$('.slider').slider('value'))
    };

    var error = function(m, e) { new views.Modal(e); };
    if (!this.model.set(attr, {error:error})) return false;

    this.model.save({}, {
        success: _(function(model) {
            this.model.trigger('save');
            this.$('.close').click();
        }).bind(this),
        error:error
    });
    return false;
};
