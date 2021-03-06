/**
 * Created by eason on 17-5-19.
 */
class ShaderProgram {
    constructor(vshader,fshader) {
        this.uniforms = {};
        this.textures = {};
        this.run = false;

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
            -1, +1,
            +1, -1,
            +1, +1
        ]), gl.STATIC_DRAW);

        this.program = WebglHelper.createProgram(vshader, fshader);

        this.vertexAttribute = gl.getAttribLocation(this.program, 'vertex');
        gl.enableVertexAttribArray(this.vertexAttribute);
    }

    render(uniforms=true,textures=true){
        gl.useProgram(this.program);

        if(!this.run) {
            this._updateUniforms();
            this._updateTextures();
            this._updateVBO();
            this.run = true;
        }else{
            if(uniforms) this._updateUniforms();
            if(textures) this._updateTextures();
        }

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    _updateUniforms(){
        for(let entry of Object.entries(this.uniforms)) {
            let location = gl.getUniformLocation(this.program, entry[0]);
            if(location == null||!entry[1]) continue;
            if(entry[1][0]=='v2') {
                gl.uniform2fv(location, new Float32Array(entry[1][1]));
            } else if(entry[1][0]=='v3') {
                gl.uniform3fv(location, new Float32Array(entry[1][1]));
            } else if(entry[1][0]=='v4') {
                gl.uniform4fv(location, new Float32Array(entry[1][1]));
            } else if(entry[1][0]=='m2') {
                gl.uniformMatrix2fv(location, false, new Float32Array(entry[1][1]));
            } else if(entry[1][0]=='m3') {
                gl.uniformMatrix3fv(location, false, new Float32Array(entry[1][1]));
            } else if(entry[1][0]=='m4') {
                gl.uniformMatrix4fv(location, false, new Float32Array(entry[1][1]));
            } else if(entry[1][0]=='int'){
                gl.uniform1i(location, entry[1][1]);
            } else if(entry[1][0]=='float'){
                gl.uniform1f(location, entry[1][1]);
            } else {
                gl.uniform1f(location, entry[1]);
            }
        }
    }

    _updateTextures(){
        for(let entry of Object.entries(this.textures)) {
            let location = gl.getUniformLocation(this.program, entry[0]);
            if(location == null) continue;

            gl.uniform1i(location,entry[1]);
        }
    }

    _updateVBO(){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.vertexAttribute, 2, gl.FLOAT, false, 0, 0);
    }
}

class WebglHelper {
    static createTexture(){
        return gl.createTexture();
    }

    static setTexture(texture,unitID,width,height,internalFormat,format,type,data,npot){
        gl.activeTexture(gl.TEXTURE0+unitID);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        if(npot){
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }else{
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, data);
    }

    static clearScreen(){
        gl.clearColor(0.0,0.0,0.0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    static createProgram(vshader, fshader){
        let vertexShader = WebglHelper.loadShader(gl.VERTEX_SHADER, vshader);
        let fragmentShader = WebglHelper.loadShader(gl.FRAGMENT_SHADER, fshader);
        if (!vertexShader || !fragmentShader) {
            return null;
        }

        let program = gl.createProgram();
        if (!program) {
            return null;
        }

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);

        let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            let error = gl.getProgramInfoLog(program);
            console.log('Failed to link program: ' + error);
            gl.deleteProgram(program);
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);
            return null;
        }
        return program;
    }

    static loadShader(type, source) {
        let shader = gl.createShader(type);
        if (shader == null) {
            console.log('unable to create shader');
            return null;
        }
        gl.shaderSource(shader, source);

        gl.compileShader(shader);

        let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            let error = gl.getShaderInfoLog(shader);
            console.log('Failed to compile shader: ' + error);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    static initWebgl(canvas){
        window.gl = null;

        try {
            gl = canvas.getContext("webgl2");
        }
        catch(e) {}
        if (!gl) {
            alert("WebGL2初始化失败，可能是因为您的浏览器不支持。");
            gl = null;
        }
        return gl;
    }
}
