class Triangle{
    constructor(vertex_0,vertex_1,vertex_2,stroke_color,fill_color){
        this.v0 = vertex_0,
        this.v1 = vertex_1,
        this.v2 = vertex_2,
        this.vertices = [this.v0, this.v1, this.v2],
        this.stroke_color = stroke_color,
        this.fill_color = fill_color
    }

    draw(ctx){
        // the triangle
        ctx.beginPath();
        ctx.moveTo(this.v0.x, this.v0.y);
        ctx.lineTo(this.v1.x, this.v1.y);
        ctx.lineTo(this.v2.x, this.v2.y);
        ctx.closePath();

        // the outline
        ctx.lineWidth = 10;
        ctx.strokeStyle = this.stroke_color;
        ctx.stroke();

        // the fill color
        ctx.fillStyle = this.stroke_color;
        ctx.fill();
    }
}

class Vertex{
    constructor(x,y,dx,dy,radius,color){
        //Position
        this.x = x,
        this.y = y,
        //Movement
        this.dx = dx,
        this.dy = dy,
        //Radius
        this.radius = radius,
        //Color
        this.color = color
    }

    
    move(environment){
        const x_is_out_of_bounds = (this.x - this.radius + this.dx < 0 || this.x + this.radius  + this.dx > environment.width)
        const y_is_out_of_bounds = (this.y - this.radius + this.dy < 0 || this.y + this.radius  + this.dy > environment.height)
        
        if(x_is_out_of_bounds){
            this.dx = this.dx * (-1)
        }
        
        if(y_is_out_of_bounds){
            this.dy = this.dy * (-1)
        }

        this.x += this.dx
        this.y += this.dy
    }
    
    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "black";
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }

}

class Environment{
    constructor(htmlElement){
        this.HTML = htmlElement,
        this.width = this.HTML.getBoundingClientRect().width,
        this.height = this.HTML.getBoundingClientRect().height
    }
}

function generateRandom(min = 0, max = 100) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor( rand * difference);
    rand = rand + min;
    return rand;
}

const colors = ['red','blue','green','yellow','orange','brown','purple','aqua']
const number_of_particles = 50
const particles = []
for (let i = 0; i<number_of_particles; i++){
    let x = generateRandom(50,350)
    let y = generateRandom(50,350)
    let dx = generateRandom(-5,5)
    let dy = generateRandom(-5,5)
    let radius = 10
    let color = colors[Math.floor(Math.random()*colors.length)];

    let particle = new Vertex(x,y,dx,dy,radius,color)
    particles.push(particle)
}

function init() {
    window.requestAnimationFrame(draw);
}

function draw() {
    const ctx = document.getElementById("canvas").getContext("2d");
    const canvas = document.getElementById("canvas");
    const environment = new Environment(canvas)

    ctx.globalCompositeOperation = "destination-over";
    ctx.clearRect(0, 0, environment.width, environment.height); // clear canvas

    for (const particle of particles){
        particle.move(environment)
        particle.draw(ctx)
    }


  window.requestAnimationFrame(draw);
}



init();
