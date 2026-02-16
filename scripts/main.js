"use script"

window.addEventListener("DOMContentLoaded", () => {

  class MyChart {
    constructor(name, data) {
      this.name = name
      this.data = data
    }
    getChart() {
      new Chart(this.name, {
        type: "line",
        data: {
          labels: [1, 2, 3, 4, 5, 6],
          datasets: [{
            label: "Test",
            data: this.data,
            borderWidth: 1,
            borderColor: "rgb(68, 123, 84)",
            pointBackgroundColor: "rgb(68, 123, 84)"
          }]
        },
        options: {
          responsive: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false,
              labels: {
                usePointStyle: true
              }
            }
          }
        }
      })
    }
  }

  // Отбивка трёх цифр
  function prettify(number) {
    let n = number.toString()
    return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + " ")
  }

  // Массив случайных чисел
  function randomArray(min, max) {
    const array = [0]
    for (let i=1; i<6; i++) {
      array.push(Math.floor(Math.random() * (max - min + 1) + min))
    }
    return array
  }

  // Показывать или скрывать графики
  document.addEventListener("click", event => {
    if (event.target.closest(".table__data")) {
      const nextSibling = event.target.closest(".table__data").nextSibling
      nextSibling.classList.toggle("hide")
    }
  })

  // Генерация таблицы
  function createTable(tableSelector, data) {
    const table = document.querySelector(`${tableSelector} tbody`)
    for (let i = 0; i < data.name.length; i++) {
      const tr = document.createElement("tr"),
            trCanvas = document.createElement("tr")
      tr.classList.add("table__data")
      tr.innerHTML = `<td><div>${data.name[i]}</div></td>
                            <td><div>${prettify(data.day[i])}</div></td>
                            <td><div>
                                    <span>${prettify(data.yesterday[i])}</span>
                                    <span>${data.percent[i]}%</span>
                                </div>
                            </td>
                            <td><div>${prettify(data.today[i])}</div></td>`
      trCanvas.innerHTML = `<td colspan="4" class="table__canvas">
                                <div class="table__graph">
                                    <canvas id="myChart-${i}" width="800" height="400"></canvas>
                                </div>
                            </td>`
      trCanvas.classList.add("table__chart", "hide")
      table.append(tr, trCanvas)

      if (data.percent[i] > 0) {
        tr.querySelector("span:nth-child(2)").classList.add("color-text-green")
        tr.querySelector("span").parentElement.classList.add("color-bg-green")
      } else if (data.percent[i] < 0) {
        tr.querySelector("span:nth-child(2)").classList.add("color-text-red")
        tr.querySelector("span").parentElement.classList.add("color-bg-red")
      }

      if (i === 0) {
        tr.querySelector("td:nth-child(4) div").classList.add("color-bg-red")
      } else if (i > 3 && i <8 || i === 9) {
        tr.querySelector("td:nth-child(4) div").classList.add("color-bg-green")
      }

      new MyChart(document.querySelector(`#myChart-${i}`), randomArray(0, 5)).getChart()
    }
  }

  // Загрузка JSON с данными для генерации таблицы
 fetchData("dataTable.json", ".table")
  function fetchData(jsonUrl, tableSelector) {
    fetch(jsonUrl)
      .then(response => response.json())
      .then(dataTable => {
        createTable(".table", dataTable)
      })
      .catch(error => console.log(error))
      .finally(() => document.querySelector(`${tableSelector} .loader`).remove())
  }
})