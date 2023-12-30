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
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.stroke_color;
        ctx.stroke();

        // the fill color
        ctx.fillStyle = this.stroke_color;
        ctx.fill();
    }

    update(environment){
        for (const vertex of this.vertices){
            vertex.update(environment)
        }
    }
}

class Vertex{
    constructor(x,y,dx,dy,ax,ay,radius,color){
        //Position
        this.x = x,
        this.y = y,
        //Distance per Animation Draw
        this.dx = dx,
        this.dy = dy,
        //Acceleration per Animation
        this.ax = ax,
        this.ay = ay,
        //Radius
        this.radius = radius,
        //Color
        this.color = color
    }

    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = this.color;
        ctx.fill();
    }    

    update(environment){
        let next_position_in_x = this.x + this.dx
        let next_position_in_y = this.y + this.dy

        const x_is_out_of_bounds = (next_position_in_x - this.radius < 0 || next_position_in_x + this.radius > environment.width)
        const y_is_out_of_bounds = (next_position_in_y - this.radius < 0 || next_position_in_y + this.radius > environment.height)
        
        if(x_is_out_of_bounds){
            this.dx = this.dx * (-1)
        }
        
        if(y_is_out_of_bounds){
            this.dy = this.dy * (-1)
        }

        next_position_in_x = this.x + this.dx
        next_position_in_y = this.y + this.dy

        this.x = next_position_in_x
        this.y = next_position_in_y
    }
}

class Environment{
    constructor(htmlElement){
        this.HTML = htmlElement,
        this.width = this.HTML.getBoundingClientRect().width,
        this.height = this.HTML.getBoundingClientRect().height,
        this.members = []
    }

    setMembers(members){
        this.members.push.apply(this.members,members);
    }

    draw(){
        const ctx = this.HTML.getContext("2d");
        let w = this.width
        let h = this.height
        ctx.globalCompositeOperation = "destination-over";
        ctx.clearRect(0, 0, w, h); // clear canvas
        
        for (const m of this.members){
            m.draw(ctx)
        }
    }

    update(){
        for (const m of this.members){
            m.update(this)
        }
    }
}

class Simulation{
    constructor(){
        this.environment = null
    }
    
    setEnvironment(environment){
        this.environment = environment
    }
    
    start(){
        if (this.environment == null){
            console.warn("No Environment set!")
            return
        }

        this.run()
    }

    update(){
        this.environment.update()
    }
    
    draw(){
        this.environment.draw()
        window.requestAnimationFrame(this.draw.bind(this))
    }
    
    run(){
        let fps = 60
        let update = this.update
        let self = this
        setInterval(function(){
            update.bind(self)()
        },1000/fps); //  note ms = 1000/fps
        window.requestAnimationFrame(this.draw.bind(this))
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
    let x = generateRandom(200,300)
    let y = generateRandom(200,300)
    let dx = generateRandom(-5,5)
    let dy = generateRandom(-5,5)
    let ax = generateRandom(-5,5)
    let ay = generateRandom(-5,5)
    let radius = 20
    let color = colors[generateRandom(0,colors.length-1)];
    //let color = colors[Math.floor(Math.random()*colors.length)];

    let particle = new Vertex(x,y,dx,dy,ax,ay,radius,color)
    particles.push(particle)
}

const vertex_0 = new Vertex(50,50,1,0.43762,1,0,0,"black")
const vertex_1 = new Vertex(25,50,-0.5,-0.4362,1,0,0,"black")
const vertex_2 = new Vertex(50,25,-1,0.5,1,0,0,"black")
const triangle = new Triangle(vertex_0,vertex_1,vertex_2,"#53ed4380","green")

window.addEventListener("load",init)
function init() {
    const canvas = document.getElementById("canvas");
    console.log(canvas)
    const environment = new Environment(canvas)
    //environment.setMembers([triangle])
    environment.setMembers(particles)
    const simulation = new Simulation()
    simulation.setEnvironment(environment)
    simulation.start()
}


