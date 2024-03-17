class Nodo {
  constructor(x, y, g, h, predecesor) {
    this.x = x;
    this.y = y;
    this.g = g; // Costo acumulado desde el nodo inicial hasta este nodo
    this.h = h; // Heurística (distancia estimada desde este nodo hasta el nodo final)
    this.predecesor = predecesor; // Nodo predecesor en el camino óptimo
  }

  esIgual(nodo) {
    return this.x === nodo.x && this.y === nodo.y;
  }

  // Función para calcular la prioridad en la cola de prioridad
  getPrioridad() {
    return this.g + this.h;
  }
}

class ColaPrioridad {
  constructor(comparador) {
    this.elementos = [];
    this.comparador = comparador;
  }

  push(elemento) {
    this.elementos.push(elemento);
    this.elementos.sort(this.comparador);
  }

  pop() {
    return this.elementos.shift();
  }

  empty() {
    return this.elementos.length === 0;
  }

  contains(nodo) {
    return this.elementos.some((elemento) => elemento.esIgual(nodo));
  }
}

function compararPorPrioridad(a, b) {
  return a.getPrioridad() - b.getPrioridad();
}

function calcularDistancia(x, y, fin) {
  return Math.sqrt(Math.pow(fin[0] - x, 2) + Math.pow(fin[1] - y, 2));
}


var caminoFinal;
var minLength = 1000000000000000;

function pintarRecorridoGrafo(inicio, fin, nFilas, nColumnas) {
  
  caminoFinal = null;
  minLength = 1000000000000000;
  let colaAbierta = new ColaPrioridad(compararPorPrioridad);
  let colaCerrada = new ColaPrioridad(compararPorPrioridad);

  inicio = inicio.split(":").map(Number);
  fin = [fin[0], fin[2]];

  colaAbierta.push(new Nodo(inicio[0], inicio[1], 0, calcularDistancia(inicio[0], inicio[1], fin), null));

  recorrerNodo(colaAbierta, colaCerrada, nFilas, nColumnas, fin);
}

function recorrerNodo(colaAbierta, colaCerrada, nFilas, nColumnas, fin) {
  let nodoOptimo = colaAbierta.pop();

  let coor = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[-1,1],[1,-1]];

  coor.forEach(function (c) {
    let nuevaX = nodoOptimo.x + c[0];
    let nuevaY = nodoOptimo.y + c[1];
    let g = nodoOptimo.g + calcularDistancia(nodoOptimo.x, nodoOptimo.y, [nuevaX, nuevaY]);
    let h = calcularDistancia(nuevaX, nuevaY, fin);
    let nodo = new Nodo(nuevaX, nuevaY, g, h, nodoOptimo);

    if (nuevaX >= 0 && nuevaX < nColumnas && nuevaY >= 0 && nuevaY < nFilas &&
        !checkObstaculo(nuevaX, nuevaY) && !colaCerrada.contains(nodo)) {
      if (nodo.x === fin[0] && nodo.y === fin[1]) {
        reconstruirCamino(nodo);
        return; 
      }
      if (!colaAbierta.contains(nodo) || g < nodo.g) {
        nodo.predecesor = nodoOptimo;
        colaAbierta.push(nodo);
      }
    }
  });

  colaCerrada.push(nodoOptimo);

  if (!colaAbierta.empty()) {
    recorrerNodo(colaAbierta, colaCerrada, nFilas, nColumnas, fin);
  }
}



function reconstruirCamino(nodo) {
  let camino = [];
  while (nodo !== null) {
    camino.push([nodo.x, nodo.y]);
    nodo = nodo.predecesor;
  }
  
  if(camino.length < minLength){
    caminoFinal = camino;
    minLength = caminoFinal.length;
  }
}

function checkObstaculo(x,y){
  const pathId = "#" +x+ "\\:" +y;
  return $(pathId).hasClass("obstaculo");
}

function crearTablaConEjemplo(nFilas,nColumnas,inicio,fin,obstaculo) {

  let currFin = 0;
  const nFilasE = nFilas;
  const nColumnasE = nColumnas;
  const inicioPos = inicio; // Posición de inicio
  const finPos = fin; // Posiciones de fin
  const obstaculosPos = obstaculo; // Posiciones de obstáculos

  let tabla = "";
  for (let r = 0; r < nFilasE; r++) {
    tabla += "<tr>";
    for (let c = 0; c < nColumnasE; c++) {
      let clase = "suelo";
      if (inicioPos[0] === r && inicioPos[1] === c) {
        clase = "start";
        inicio = r + ":" + c;
      } else if (finPos.some(posicion => posicion[0] === r && posicion[1] === c)) {
        clase = "end";
        let aux = "";
        aux = r + ":" + c;
        console.log(aux)
        fin.push(aux);
      } else if (obstaculosPos.some(posicion => posicion[0] === r && posicion[1] === c)) {
        clase = "obstaculo";
      }
      tabla += `<td id="${r}:${c}" class="${clase}"></td>`;
    }
    tabla += "</tr>";
  }

  $("#tabla").html(tabla);

  let $play = `<button class="btn btn-primary">Start</button>`
    
    $("#play").html($play);

    $("#play").on("click", function(){
      pintarRecorridoGrafo(inicio,fin[currFin],nFilas,nColumnas);
      currFin++;
      console.log(caminoFinal);
      if(caminoFinal != null){
      caminoFinal.forEach(function(e,index){
        console.log(e);
        if(index != 0 && index != caminoFinal.length-1){
          var lastMove = [];
          lastMove[0] = prev[0] - e[0];
          lastMove[1] = prev[1] - e[1];
          const pathId = "#" +e[0]+ "\\:" +e[1];
          $(pathId).removeClass("start end obstaculo").addClass("flecha"+(~~lastMove[0])+ "" + (~~lastMove[1]));
        }
        prev = e;
      })
      inicio = fin[currFin-1];
      }
      else{
        alert("No se puede llegar al destino!")
      }

    });

    $("#tabla").html(tabla);

    document.documentElement.style.setProperty('--nFilas', nFilas);
    document.documentElement.style.setProperty('--nColumnas', nColumnas);

    $("td").click(function() {
      selectedCell = $(this);
      $('#optionModal').modal('show'); 
    });
}


$(document).ready(function(){
  let inicio;
  let fin = [];
  let currFin = 0;
  let nFilas = 0;
  let nColumnas = 0;

  $("#boton").on("click",function(){
    nFilas = $("#nFilas").val();
    nColumnas = $("#nColumnas").val();
    
    let filas="";
    for(let r=0; r<nFilas; r++){
      filas+= "<tr>";
      for(let c=0; c<nColumnas; c++){
        filas+= `<td id="${r+":"+c}" class="suelo"></td>`;
      }
      filas+= "</tr>";
    }

    let $play = `<button class="btn btn-primary">Start</button>`
    
    $("#play").html($play);

    $("#play").on("click", function(){
      pintarRecorridoGrafo(inicio,fin[currFin],nFilas,nColumnas);
      currFin++;
      console.log(caminoFinal);
      if(caminoFinal != null){
      caminoFinal.forEach(function(e,index){
        console.log(e);
        if(index != 0 && index != caminoFinal.length-1){
          var lastMove = [];
          lastMove[0] = prev[0] - e[0];
          lastMove[1] = prev[1] - e[1];
          const pathId = "#" +e[0]+ "\\:" +e[1];
          $(pathId).removeClass("start end obstaculo").addClass("flecha"+(~~lastMove[0])+ "" + (~~lastMove[1]));
        }
        prev = e;
      })
      inicio = fin[currFin-1];
      }
      else{
        alert("No se puede llegar al destino!")
      }

    });

    $("#tabla").html(filas);

    document.documentElement.style.setProperty('--nFilas', nFilas);
    document.documentElement.style.setProperty('--nColumnas', nColumnas);

    $("td").click(function() {
      selectedCell = $(this);
      $('#optionModal').modal('show'); 
    });
  });

    $(".option").click(function() {
      const option = $(this).data("option");
      selectedCell.removeClass("start end obstaculo suelo").addClass(option);
      switch(option){
        case "start":
          inicio = selectedCell.attr('id');
          console.log(inicio);
          break;
        case "end":
          fin.push(selectedCell.attr('id'));
          console.log(fin);
          break;
      }
      
      $('#optionModal').modal('hide'); 
    });

  $("#crearTablaConEjemplo").on("click", function(){
    crearTablaConEjemplo(10,10,[0,0],[[2, 5], [7, 7]],[[0, 2], [1, 2], [2, 2],[3, 2],[4, 2],[5, 2],[3,0],[5,1]]);
  });


  });



