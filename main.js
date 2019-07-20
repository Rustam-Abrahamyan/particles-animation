function Particle(o) {
    this.C = document.createElement('canvas');
    document.body.appendChild(this.C);

    o = o !== undefined ? o : {};

    this.o = {
        w: (o.w !== undefined) ? o.w : window.innerWidth,
        h: (o.h !== undefined) ? o.h : window.innerHeight,
        c: (o.c !== undefined) ? o.c : '#fff',
        b: (o.b !== undefined) ? o.b : '#000',
        i: (o.i !== undefined) ? o.i : true,
        s: (o.s !== undefined) ? o.s : 0.5,
        d: (o.d !== undefined) ? o.d : 10000
    };

    this.C.size = {
        w: this.o.w,
        h: this.o.h
    };

    this._i();
}

Particle.prototype._i = function () {
    if ((/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i).test(this.o.b)) {
        this.C.parentElement.style.background = this.o.b;
    }

    this.$ = this.C.getContext('2d');
    this.C.width = this.C.size.w;
    this.C.height = this.C.size.h;

    this.p = [];

    for (let i = 0; i < this.C.width * this.C.height / this.o.d; i++) {
        this.p.push(new P(this));
    }

    if (this.o.i) {
        this.m = new P(this);
        this.m.s = {
            x: 0,
            y: 0
        };
        this.p.push(this.m);

        this.C.addEventListener('mouseup', function (e) {
            this.m.x = e.clientX;
            this.m.y = e.clientY;
            this.m.s = {
                x: (Math.random() - 0.5) * this.o.s,
                y: (Math.random() - 0.5) * this.o.s
            };
            this.m = new P(this);
            this.m.s = {
                x: 0,
                y: 0
            };
            this.p.push(this.m);
        }.bind(this));
    }

    requestAnimationFrame(this._u.bind(this));
};

Particle.prototype._u = function () {
    this.$.clearRect(0, 0, this.C.width, this.C.height);
    this.$.globalAlpha = 1;

    for (let i = 0; i < this.p.length; i++) {
        this.p[i]._u();
        this.p[i]._d();

        for (let j = this.p.length - 1; j > i; j--) {
            let distance = Math.sqrt(
                Math.pow(this.p[i].x - this.p[j].x, 2)
                + Math.pow(this.p[i].y - this.p[j].y, 2)
            );
            if (distance > 120) continue;

            this.$.beginPath();
            this.$.strokeStyle = this.o.c;
            this.$.globalAlpha = (120 - distance) / 120;
            this.$.lineWidth = 0.7;
            this.$.moveTo(this.p[i].x, this.p[i].y);
            this.$.lineTo(this.p[j].x, this.p[j].y);
            this.$.stroke();
        }
    }

    if (this.o.s !== 0) {
        requestAnimationFrame(this._u.bind(this));
    }
};

function P(_) {
    this.C = _;
    this.$ = _.$;
    this.c = _.o.c;

    this.x = Math.random() * _.o.w;
    this.y = Math.random() * _.o.h;

    this.s = {
        x: (Math.random() - 0.5) * _.o.s,
        y: (Math.random() - 0.5) * _.o.s
    };
}

P.prototype._u = function () {

    if (this.x > this.C.width + 20 || this.x < -20) {
        this.s.x = -this.s.x;
    }
    if (this.y > this.C.height + 20 || this.y < -20) {
        this.s.y = -this.s.y;
    }

    this.x += this.s.x;
    this.y += this.s.y;
};

P.prototype._d = function () {

    this.$.beginPath();
    this.$.fillStyle = this.c;
    this.$.globalAlpha = 0.7;
    this.$.arc(this.x, this.y, 1.5, 0, 2 * Math.PI);
    this.$.fill();
};

new Particle({
    w: window.innerWidth,
    h: window.innerHeight,
    c: '#EEE',
    b: '#333',
    i: true,
    s: 0.7,
    d: 5000
});
