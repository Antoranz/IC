class Nodo {
  constructor(x,y, distanciaFinal, predecesor) {
      this.x = x;
      this.y = y;
      this.distanciaFinal = distanciaFinal;
      this.predecesor = predecesor;
  }

  esIgual(nodo){
    return this.x == nodo.x && this.y == nodo.y && this.distanciaFinal == nodo.distanciaFinal;
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
  contains(nodo){
    this.elementos.forEach(function(c){
      if(c.esIgual(nodo)){
        console.log("true");
        return true;
      }
    });
    return false;
  }

}

function compararPorDistancia(a, b) {
  return a.distanciaFinal - b.distanciaFinal;
}

const colaAbierta = new ColaPrioridad(compararPorDistancia);
const colaCerrada = new ColaPrioridad(compararPorDistancia);

function calcularDistancia(x, y, fin) {
  return Math.sqrt(Math.pow(fin[0] - x, 2) + Math.pow(fin[1] - y, 2));
}

function pintarRecorridoGrafo(inicio, fin, nFilas, nColumnas){
  let coor = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[-1,1],[1,-1]];
  let colaAbierta = new ColaPrioridad(compararPorDistancia);
  let colaCerrada = new ColaPrioridad(compararPorDistancia);

  inicio = inicio.split(":").map(Number); 
  fin = fin.split(":").map(Number); 
  colaAbierta.push(new Nodo(inicio[0], inicio[1], calcularDistancia(inicio[0], inicio[1], fin), null));


}

function recorrerNodo(colaAbierta, colaCerrada, nFilas, nColumnas){
  let nodoOptimo = colaAbierta.pop();
  coor.forEach(function (c) {
      let nuevaX = nodoOptimo.x + c[0];
      let nuevaY = nodoOptimo.y + c[1];
      let nodo = new Nodo(nuevaX,nuevaY,calcularDistancia(nuevaX,nuevaY,fin), c);
      if (nuevaX >= 0 && nuevaX < nColumnas && nuevaY >= 0 && nuevaY < nFilas && !checkObstaculo(nuevaX,nuevaY) && !colaCerrada.contains(nodo) && !colaAbierta.contains(nodo)) {
        if (nodoOptimo.x === fin[0] && nodoOptimo.y === fin[1]) {
          return nodoOptimo;
        }
        recorrerNodo(colaAbierta, colaCerrada, nFilas, nColumnas);
      }
    });
}

function checkObstaculo(x,y){
  const pathId = "#" +x+ "\\:" +y;
  return $(pathId).hasClass("obstaculo");
}

$(document).ready(function(){
  let inicio;
  let fin;
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
      var colaCerrada = pintarRecorridoGrafo(inicio,fin,nFilas,nColumnas);
      var i = 0;
      var prev;
      console.log(colaCerrada);
      colaCerrada.elementos.forEach(function(e){
        if(i != 0 && i != colaCerrada.elementos.length-1){
          var lastMove = [];
          lastMove[0] = prev.x - e.x;
          lastMove[1] = prev.y - e.y;
          const pathId = "#" +e.x+ "\\:" +e.y;
          $(pathId).removeClass("start end obstaculo").addClass("flecha"+(~~lastMove[0])+ "" + (~~lastMove[1]));
        }
        prev = e;
        i++;
      });
    });

    $("#tabla").html(filas);

    // Establecer variables CSS personalizadas
    document.documentElement.style.setProperty('--nFilas', nFilas);
    document.documentElement.style.setProperty('--nColumnas', nColumnas);

    // Asignar evento de clic a cada celda
    $("td").click(function() {
        selectedCell = $(this);
        $('#optionModal').modal('show'); // Mostrar el modal cuando se hace clic en una celda
    });
 
  });

  // Manejar la selección de opción del modal
  $(".option").click(function() {
    const option = $(this).data("option");
    selectedCell.removeClass("start end obstaculo suelo").addClass(option);
    switch(option){
      case "start":
        inicio = selectedCell.attr('id');
        console.log(inicio);
        break;
      case "end":
        fin = selectedCell.attr('id');
        console.log(fin);
        break;
    }
    
    $('#optionModal').modal('hide'); // Ocultar el modal después de seleccionar una opción
  });

});

