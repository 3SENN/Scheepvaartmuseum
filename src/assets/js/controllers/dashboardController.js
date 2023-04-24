/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import {DataRepository} from "../repositories/dataRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";

export class dashboardController extends Controller {

    #welcomeView
    #dataRepository
    #roomsExampleRoutes

    myChart;
    myGasChart;

    constructor() {
        super();
        this.#dataRepository = new DataRepository();
        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#welcomeView = await super.loadHtmlIntoDashboard("html_views/dashboard.html")
        await this.#dataCards();
        // document.getElementById("selectFloor").addEventListener("change", async event => {
        //     await this.#showFloorData()
        // });
        document.getElementById("customSwitches").addEventListener("change", event => this.compareSwitch());
        await this.#loadChart("electricity", 'line', "#myAreaChart", document.getElementById("sortElectricity").value, 1);
        await this.fillRoomDropdown()
        document.getElementById("loadButton").addEventListener("click", async event => await this.giveChartData());
        this.#loadPieChart();
        document.getElementById("sortElectricity").addEventListener("change", event => this.preferenceDropdown());
        document.getElementById("loadButton").addEventListener("click", async event => await this.#displayEnergyResult(document.getElementById("sortElectricity").value));
    }

    /**
     * gives data to LoadChart
     * @returns {Promise<void>}
     */
    async giveChartData() {
        const roomSelected = document.getElementById("selectRoom").value;
        let lineButton;
        if (document.getElementById("lineButton").checked) {
            lineButton = "line";
        } else {
            lineButton = "bar";
        }
        if (roomSelected === "Algemeen") {
            if (document.getElementById("sortElectricity").value === "years") {
                if (document.getElementById("lineButton").checked) {
                    await this.#loadChart("years", 'line', "#myAreaChart", document.getElementById("sortElectricity").value, 1);
                } else {
                    await this.#loadChart("years", 'bar', "#myAreaChart", document.getElementById("sortElectricity").value, 1);
                }
            } else {
                await this.#loadChart("electricity", lineButton, "#myAreaChart", document.getElementById("sortElectricity").value, 1);
            }
        } else {
            await this.#loadChart("room", lineButton, "#myAreaChart", document.getElementById("sortElectricity").value, roomSelected);
        }
    }

    /**
     * compare switch
     * hides unnecessary html functionality
     */
    preferenceDropdown() {
        switch (document.getElementById("sortElectricity").value) {
            case "years":
                console.log("year")
                document.querySelector(".date-box-preference").style.display = "none";
                document.querySelector(".roomBox").style.display = "none";
                document.querySelector(".year-preference-text").style.display = "block";
                break;
            case "year":
                console.log("month")
                document.querySelector(".date-box-preference").style.display = "block";
                document.querySelector(".roomBox").style.display = "block";
                document.querySelector("#sortDayElectricity").style.display = "none";
                document.querySelector("#sortMonthElectricity").style.display = "none";
                document.querySelector("#sortYearElectricity").style.display = "block";
                document.querySelector(".year-preference-text").style.display = "none";
                break;
            case "month":
                console.log("day")
                document.querySelector(".date-box-preference").style.display = "block";
                document.querySelector(".roomBox").style.display = "block";
                document.querySelector("#sortYearElectricity").style.display = "block";
                document.querySelector("#sortMonthElectricity").style.display = "block";
                document.querySelector("#sortDayElectricity").style.display = "none";
                document.querySelector(".year-preference-text").style.display = "none";
                break;
            case "day":
                console.log("uur")
                document.querySelector(".date-box-preference").style.display = "block";
                document.querySelector(".roomBox").style.display = "block";
                document.querySelector("#sortYearElectricity").style.display = "block";
                document.querySelector("#sortMonthElectricity").style.display = "block";
                document.querySelector("#sortDayElectricity").style.display = "block";
                document.querySelector(".year-preference-text").style.display = "none";
                break;
            default:
                document.querySelector(".date-box-preference").style.display = "block";
                document.querySelector(".roomBox").style.display = "block";
        }
    }

    /**
     * compare switch
     * hides unnecessary html functionality
     */
    compareSwitch() {
        switch (document.getElementById("customSwitches").checked) {
            case true:
                document.querySelector(".extraLine").style.display = "block";
                document.querySelector("#sortElectricity").style.display = "block";
                document.querySelector(".roomBox").style.display = "none";
                document.querySelector("#sortElectricity").style.display = "none";
                document.querySelector("#selectRoom").value = 'Algemeen';
                console.log(document.querySelector("#selectRoom").value)
                document.querySelector("#sortYearElectricity").style.display = "block";
                document.querySelector("#sortMonthElectricity").style.display = "block";
                document.querySelector("#sortDayElectricity").style.display = "none";
                document.querySelector("#compareDayElectricity").style.display = "none";
                break;
            case false:
                document.querySelector(".extraLine").style.display = "none";
                document.querySelector("#sortElectricity").style.display = "block";
                document.querySelector(".roomBox").style.display = "block";
                document.querySelector("#sortElectricity").value = "day";
                document.querySelector("#sortDayElectricity").style.display = "block";

                break;
            default:
                document.querySelector(".extraLine").style.display = "none";
        }

    }


    /**
     *
     * Function for loading pie chart.
     * Gets data from today by API call, and loads it into pie chart
     *
     * @returns {Promise<void>}
     */
    async #loadPieChart() {
        let today = new Date();
        let roomFetch = await this.#dataRepository.getAllRooms();
        let minusOneFloorData = 0;
        let zeroFloorData = 0;
        let firstFloorData = 0;
        let secondFloorData = 0;
        for (let i = 0; i < roomFetch.length; i++) {
            switch (roomFetch[i].floor) {
                case -1:
                    const minusOneFloor = await this.#dataRepository.getRoomDataDay(roomFetch[i].id, 2021, today.getMonth() + 1, today.getDate());
                    minusOneFloorData += minusOneFloor[i].electricity
                    break
                case 0:
                    const zeroFloor = await this.#dataRepository.getRoomDataDay(roomFetch[i].id, 2021, today.getMonth() + 1, today.getDate());
                    zeroFloorData += zeroFloor[i].electricity
                    break
                case 1:
                    const firstFloor = await this.#dataRepository.getRoomDataDay(roomFetch[i].id, 2021, today.getMonth() + 1, today.getDate());
                    firstFloorData += firstFloor[i].electricity
                    break
                case 2:
                    const secondFloor = await this.#dataRepository.getRoomDataDay(roomFetch[i].id, 2021, today.getMonth() + 1, today.getDate());
                    secondFloorData += secondFloor[i].electricity
                    break
            }
        }
        if (this.piechart) {
            this.piechart.destroy();
        }
        const ctx = this.#welcomeView.querySelector("#pie_chart").getContext('2d');
        this.piechart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    '-1',
                    '0',
                    '1', '2'
                ],
                datasets: [{
                    label: 'VerdiepingenO',
                    data: [minusOneFloorData, zeroFloorData, firstFloorData, secondFloorData],
                    borderWidth: 0,
                    backgroundColor: [
                        "#ea2962", "#0dcaf0", "#198754", "#ffc107"
                    ],
                    borderColor: [
                        '#ffffff'
                    ],
                    hoverOffset: 8
                }]
            },
        });

        const ctx2 = this.#welcomeView.querySelector("#second_chart").getContext('2d');
        this.piechart = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: [
                    'kamer1',
                    'kamer2',
                    'kamer3',
                    'kamer4',
                    'kamer5',
                    'kamer6'
                ],
                datasets: [{
                    label: 'Roomdata',
                    data: [25, 15, 12, 18, 13, 50],
                    borderWidth: 0,
                    backgroundColor: [
                        "#ea2962", "#12b7b7", "#1852c9", "#ffc107", "#8c0de5", "#4ee81a"
                    ],
                    borderColor: [
                        '#ffffff'
                    ],
                    hoverOffset: 8
                }]
            },
        });
    }

    /**
     * get dropdown from html
     * api gives room names
     * makes elements for every room and put in dropdown
     * @returns {Promise<void>}
     */
    async fillRoomDropdown() {
        var select = document.getElementById("selectRoom");
        let rooms = await this.#dataRepository.getAllRooms();
        for (let i = 0; i < 22; i++) {
            var option = document.createElement('option');
            option.text = rooms[i].name
            option.setAttribute("value", rooms[i].id)
            select.add(option, i);
        }
    }

    /**
     *
     * function for showing data on dashboard cards
     * get data using API call and displays it on data cards
     * also sums the entire day worth of electricity and displays that
     * checks emissions of Co2 and calculates amount of trees it takes to compensate
     *
     *
     * @returns {Promise<void>}
     */
    async #dataCards() {

        // Switch case for taking next iteration in array and displaying the correct data
        let today = new Date();
        let dayData = await this.#dataRepository.getDay(2021, today.getMonth() + 1, today.getDate());
        for (let i = 0; i < today.getHours(); i++) {
            document.getElementById("realtimeDayElectricity").innerHTML = dayData[i].electricity + " KWH";

        }

        // Loop door de opgehaalde datum, telt de waarden bij elkaar op, zodat je uitkomt bij het gemiddelde voor gas en elektra.
        //Vult de data in op de datacards
        let sumElectricity = 0;
        let sumGas = 0;

        for (let i = 0; i < dayData.length; i++) {
            sumElectricity += dayData[i].electricity;
            sumGas += dayData[i].gas;
            document.getElementById("electricityDay").innerHTML = sumElectricity.toFixed(2) + " KWH"
            document.getElementById("amount_Co2").innerHTML = (sumElectricity * 0.649).toFixed(2) + " KG"
            document.getElementById("amount_trees").innerHTML = ((sumElectricity * 0.649) / 26.635).toFixed(0) + " bomen"

        }
    }


    /**
     * Fills the day dropdown when selecting a day (after having selected year and month) on the dashboard.
     * @param year - To check for leap years
     * @param month - To check for short and long months and february/leap february
     * @returns {Promise<void>}
     */
    async #fillDayDropdown(year, month, day) {

        new Date;
        Date.parse
        //Normale hoeveelheid dagen + 1 omdat de for loop altijd 1 minder aangeeft omdat het begint op de 1
        const LONG_MONTH = 32;
        const SHORT_MONTH = 31;
        const FEBRUARY = 29;
        const FEBRUARY_LEAP = 30;

        if (month == "2" && year % 100 === 0 && year % 400 === 0 && year % 4 === 0) {
            day.innerHTML = ""
            for (let i = 1; i < FEBRUARY_LEAP; i++) {
                day.innerHTML += '<option value="' + i + '" selected="selected">' + i + '</option>';
            }
        } else if (month === "2") {
            day.innerHTML = ""
            for (let i = 1; i < FEBRUARY; i++) {
                day.innerHTML += '<option value="' + i + '" selected="selected">' + i + '</option>';
            }
        } else if (month === "4" || month === "6" || month === "9" || month === "11") {
            day.innerHTML = ""
            for (let i = 1; i < SHORT_MONTH; i++) {
                day.innerHTML += '<option value="' + i + '" selected="selected">' + i + '</option>';
            }
        } else {
            day.innerHTML = ""
            for (let i = 1; i < LONG_MONTH; i++) {
                day.innerHTML += '<option value="' + i + '" selected="selected">' + i + '</option>';
            }
        }

    }

    /**
     * Changes the timestamp to DD/MM/YY and formats dates to only what is needed
     * @param input - timestamp input
     * @param type - type of input to change date formatting
     * @returns {string} - formatted date
     */
    #formatDate(input, type) {
        // Regex locates all digit characters and put those seperated by a non-digit character into an array
        let datePart = input.match(/\d+/g),
            year = datePart[0],
            month = datePart[1], day = datePart[2], hour = datePart[3] + ':' + datePart[4];
        if (type === "day") {
            return day + '/' + month + '/' + year;
        } else if (type === "month") {
            return month + '/' + year;

        } else if (type === "year") {
            return year;
        } else {
            return hour
        }
    }

    /**
     * Displays the result of the increased/decreased/unchanged energy usage by increasing or decreasing the number of icebergs and ice platforms displayed on the "Result of energy usage" screen
     * @param data - Checks if it should compare data of the year, month or day
     * @returns {Promise<void>}
     */
    async #displayEnergyResult(data) {
        let pastData;

        let yearValue = document.getElementById("sortYearElectricity").value;
        let monthValue = document.getElementById("sortMonthElectricity").value;
        let dayValue = document.getElementById("sortDayElectricity").value;

        let pastYearValue = yearValue - 1;
        let pastMonthValue = monthValue - 1;
        let pastDayValue = dayValue - 1;

        let dayDropdown = document.getElementById('sortDayElectricity');
        let lastValue = dayDropdown.options[dayDropdown.length - 1].value;

        const LOWEST_YEAR = 2018;
        const LOWEST_NUMBER = 1;
        const MAX_MONTH = 12;
        const LONG_MONTH = 32;
        const SHORT_MONTH = 31;
        const FEBRUARY = 29;
        const FEBRUARY_LEAP = 30;

        if (pastYearValue < LOWEST_YEAR) {
            pastYearValue = LOWEST_YEAR
        }
        if (pastMonthValue < LOWEST_NUMBER) {
            pastMonthValue = MAX_MONTH
        } else if (pastMonthValue > MAX_MONTH) {
            pastMonthValue = LOWEST_NUMBER
        }
        if (pastDayValue > lastValue) {
            pastDayValue = LOWEST_NUMBER
        } else if (pastDayValue < 1 && pastMonthValue == 2 && pastYearValue % 100 === 0 && pastYearValue % 400 === 0 && pastYearValue % 4 === 0) {
            pastDayValue = FEBRUARY_LEAP
        } else if (pastDayValue < 1 && pastMonthValue === 2) {
            pastDayValue = FEBRUARY
        } else if (pastDayValue < 1 && pastMonthValue === 4 || pastMonthValue === 6 || pastMonthValue === 9 || pastMonthValue === 11) {
            pastDayValue = SHORT_MONTH
        } else if (pastDayValue < 1) {
            pastDayValue = LONG_MONTH
        }

        console.log(lastValue)

        console.log(pastYearValue)
        console.log(pastMonthValue)
        console.log(pastDayValue)

        let yearData = await this.#dataRepository.getYear(yearValue)
        let monthData = await this.#dataRepository.getMonth(yearValue, monthValue)
        let dayData = await this.#dataRepository.getDay(yearValue, monthValue, dayValue)

        let pastYearData = await this.#dataRepository.getYear(pastYearValue)
        let pastMonthData = await this.#dataRepository.getMonth(pastYearValue, pastMonthValue)
        let pastDayData = await this.#dataRepository.getDay(pastYearValue, pastMonthValue, pastDayValue)

        console.log(pastYearData)
        console.log(pastMonthData)
        console.log(pastDayData)

        if (data === "year") {
            data = yearData;
            pastData = pastYearData;
        } else if (data === "month") {
            data = monthData;
            pastData = pastMonthData;
        } else if (data === "day") {
            data = dayData;
            pastData = pastDayData;
        }
        console.log(pastData)
        document.querySelector(".ice-platform-container").innerHTML = ""
        document.querySelector(".iceberg-container").innerHTML = ""

        let dataElectricity = 0;
        let pastDataElectricity = 0;

        for (let i = 0; i < data.length; i++) {
            dataElectricity += data[i].electricity;
            pastDataElectricity += pastData[i].electricity;
        }

        console.log(dataElectricity)
        console.log(pastDataElectricity)

        console.log(data)

        if (dataElectricity < pastDataElectricity) {
            document.getElementById("resultText").innerHTML = `Het energieverbruik is vergeleken met vorige periode lager geworden! De ijskappen worden hersteld! Goed bezig!`

            for (let i = 0; i < 3; i++) {
                document.querySelector(".iceberg-container").innerHTML += `<img src="../assets/img/iceberg.png"
                             class="img-fluid iceberg"
                             style="z-index: 0; position: relative; margin-top: -5%; height: auto; width: auto; min-width: 100px">`
            }
            for (let i = 0; i < 9; i++) {

                document.querySelector(".ice-platform-container").innerHTML += `<img src="../assets/img/ice-platform.png"
                             class="img-fluid ice-platform"
                             style="max-width: 200px; min-width: 50px">`
            }
        } else if (dataElectricity > pastDataElectricity) {
            document.getElementById("resultText").innerHTML = `Het energieverbruik is vergeleken met vorige periode hoger geworden! De ijskappen smelten...`

            for (let i = 0; i < 4; i++) {
                document.querySelector(".ice-platform-container").innerHTML += `<img src="../assets/img/ice-platform.png"
                             class="img-fluid ice-platform"
                             style="max-width: 200px; min-width: 50px">`
            }
        } else if (pastYearValue < LOWEST_YEAR) {
            document.getElementById("resultText").innerHTML = `Er is geen data beschikbaar voor de vorige periode van de gekozen periode!`
        } else {
            document.getElementById("resultText").innerHTML = `Het energieverbruik is vergeleken met vorige periode niet veranderd!`
            for (let i = 0; i < 2; i++) {
                document.querySelector(".iceberg-container").innerHTML += `<img src="../assets/img/iceberg.png"
                             class="img-fluid iceberg"
                             style="z-index: 0; position: relative; margin-top: -5%; height: auto; width: auto; min-width: 100px">`
            }

            for (let i = 0; i < 6; i++) {
                document.querySelector(".ice-platform-container").innerHTML += `<img src="../assets/img/ice-platform.png"
                             class="img-fluid ice-platform"
                             style="max-width: 200px; min-width: 50px">`
            }
        }


    }

    /**
     * Loads graph and allows comparison between data
     * @param type - What type of data the graph can expect (rooms or years)
     * @param graphType - Whether to show a line graph or bar graph
     * @param place - Contains ID of the graph
     * @param date - What period to use (year/month/day)
     * @param room - What room to retrieve data from
     * @returns {Promise<void>}
     */
    async #loadChart(type, graphType, place, date, room) {
        if (this.myChart) {
            this.myChart.destroy();
        }
        /*
            - Zorg er voor dat de chart op jaar, maand, dag + area van museum werkt
            - Zorg er voor dat na selectie op de dropdown van dag, het geselecteerde nummer te zien is
            - Zorg er voor dat na kiezen van een maand, de dropdown van dag selectie meteen updatet (en niet in februari 31 dagen laat zien tot je een andere dag kiest)
         */

        //Zorgt er voor dat data uit de API gehaald wordt en in de grafiek gezet wordt. Specifiek uit het jaar 2020.
        let yearValue = document.getElementById("sortYearElectricity").value;
        let monthValue = document.getElementById("sortMonthElectricity").value;
        let dayValue = document.getElementById("sortDayElectricity").value;

        let dayElement = document.getElementById("sortDayElectricity");

        await this.#fillDayDropdown(yearValue, monthValue, dayElement);

        let yearData = await this.#dataRepository.getYear(yearValue)
        let monthData = await this.#dataRepository.getMonth(yearValue, monthValue)
        let dayData = await this.#dataRepository.getDay(yearValue, monthValue, dayValue)

        let roomData = await this.#dataRepository.getRoomData(room, yearValue);

        let yearDataArray = [];
        let yearDataArray2 = [];
        let yearArray = [];
        let yearArray2 = [];

        let yearValue2 = document.getElementById("compareYearElectricity").value;
        let monthValue2 = document.getElementById("compareMonthElectricity").value;
        let dayValue2 = document.getElementById("compareDayElectricity").value;
        let yearData2 = await this.#dataRepository.getYear(yearValue2)
        let monthData2 = await this.#dataRepository.getMonth(yearValue2, monthValue2)
        let dayData2 = await this.#dataRepository.getDay(yearValue2, monthValue2, dayValue2)
        let date2 = [];
        let dayElement2 = document.getElementById("compareDayElectricity");

        await this.#fillDayDropdown(yearValue2, monthValue2, dayElement2);

        if (date === "year") {
            date = yearData;
            date2 = yearData2;
        } else if (date === "month") {
            date = monthData;
            date2 = monthData2;
        } else if (date === "day") {
            date = dayData;
            date2 = dayData2;
        }
        let labelName;
        let compareLabelName = "Verbruik vergeleken elektriciteit"

        //Stopt de elektriciteitsverbruik data per maand van het jaar 2020 in de grafiek
        //en ook de timestamp
        if (type === "electricity") {
            for (let i = 0; i < date.length; i++) {
                yearDataArray.push(date[i].electricity)
                if (date === yearData) {
                    yearArray.push(this.#formatDate(date[i].timestamp, 'month'))
                } else if (date === monthData) {
                    yearArray.push(this.#formatDate(date[i].timestamp, 'day'))
                } else if (date === dayData) {
                    yearArray.push(this.#formatDate(date[i].timestamp, 'hour'))
                } else {
                    yearArray.push(this.#formatDate(date[i].timestamp, 'year'))

                }

            }
            labelName = "Verbruik elektriciteit"
        }
        for (let i = 0; i < date2.length; i++) {
            yearDataArray2.push(date2[i].electricity)
            yearArray2.push(date2[i].timestamp)
        }
        if (type === "room") {
            for (let i = 0; i < roomData.length; i++) {
                yearDataArray.push(roomData[i].electricity)
                yearArray.push(roomData[i].timestamp)
            }
            labelName = "Verbruik kamer"
        }
        if (type === "years") {
            let year = 2018;
            let month = 1;
            let yearsData = 0;
            for (let i = 0; i < 4; i++) {
                // let data = await this.#dataRepository.getYear(year)
                for (let j = 0; j < 12; j++) {
                    let dataYear = await this.#dataRepository.getMonth(year, month);
                    yearsData += dataYear[i].electricity;
                    month += 1;
                }
                console.log(yearsData)
                yearDataArray.push(yearsData)
                if (year === yearData) {
                    yearArray.push(year)
                } else {
                    yearArray.push(year)
                }
                year += 1;
                month = 0;
                yearsData = 0;
            }
            labelName = "Verbruik elektriciteit"
        }
        let datasets = [{
            label: "Verbruik in KwH",
            data: yearDataArray,
            backgroundColor: [
                'rgba(54, 100, 235, 0.2)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 3,
            fill: true
        }, {
            label: "Verbruik in KwH vergeleken datum",
            data: 0,
            backgroundColor: [
                'rgba(235, 162, 54, 1)'
            ],
            borderColor: [
                'rgba(235, 162, 54, 1)'
            ],
            borderWidth: 1
        }]
        if (document.getElementById("customSwitches").checked) {
            console.log("anderssssssss")
            datasets = [{
                label: 'Verbruik in KwH',
                data: yearDataArray,
                borderColor: "rgba(13, 110, 253, 1)",
                backgroundColor: "rgba(13, 110, 253, 1)",
                borderWidth: 3,
                fill: false
            },
                {
                    label: 'Verbruik in KwH vergeleken datum',
                    data: yearDataArray2,
                    borderColor: "rgba(255, 193, 7, 1)",
                    backgroundColor: "rgba(255, 193, 7, 1)",
                    borderWidth: 3,
                    fill: false
                }
            ]
            console.log(yearDataArray2)
        } else
            console.log(document.getElementById("customSwitches").checked)
        const ctx = this.#welcomeView.querySelector(place).getContext('2d');

        this.myChart = new Chart(ctx, {
            type: graphType,
            data: {
                labels: yearArray,
                datasets: datasets
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'easeInOutBounce',
                        from: 1,
                        to: 0,
                        loop: false
                    }
                }
            }
        });
    }
}