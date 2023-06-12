import React from "react";
import TableBody from "./STableBody";
import TableHead from "./STableHead";
import axios from "axios";
import {config} from "../../../config";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import './STable.css'
import "react-datepicker/dist/react-datepicker.css";

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            panelLogs: [],
            userLogs: [],
            sortedData: [],
            search: '',
            currentPage: 1,
            pageSize: 15,
            startDate: new Date(moment().subtract(1, 'days').toDate()),
            endDate: new Date(),
            loading: false, // Ajout de l'état loading
        };
    }


    async actualize() {
        this.setState({loading: true});
        let url = config.domain_name +"/panelLogs?startDate=" + moment(this.state.startDate).format('DD/MM/YY HH:mm:ss') + "&endDate=" + moment(this.state.endDate).format('DD/MM/YY HH:mm:ss') + '&page=' + this.state.currentPage + '&pageSize=' + this.state.pageSize;
        console.log(moment(this.state.startDate).format('DD/MM/YY HH:mm:ss'));

        await axios.get(url)
            .then((Reponse) => {
                this.setState({
                    panelLogs: Reponse.data,

                });
            })
            .catch((error) => {
                console.log(error);
            });
        url = config.domain_name +"/userLogs?startDate=" + moment(this.state.startDate).format('DD/MM/YY HH:mm:ss') + "&endDate=" + moment(this.state.endDate).format('DD/MM/YY HH:mm:ss');
        console.log(moment(this.state.startDate).format('DD/MM/YY HH:mm:ss'));
        await axios.get(url)
            .then((Reponse) => {
                this.setState({
                    userLogs: Reponse.data,
                    // loading: false, // Mettre l'état loading à false
                });
            })
            .catch((error) => {
                console.log(error);
            });

        // Merge panelLogs and userLogs
        const mergedValues = [...this.state.panelLogs, ...this.state.userLogs];

        // Sort mergedValues by date
        mergedValues.sort((a, b) => {
            const dateA = moment(a.date, 'DD/MM/YY HH:mm:ss');
            const dateB = moment(b.date, 'DD/MM/YY HH:mm:ss');
            return dateA.isBefore(dateB) ? 1 : -1;
        });

        await this.setState({
            tableData: mergedValues,
            loading: false, // Mettre l'état loading à false
        });


    }

    async componentDidMount() {
        await this.actualize()
            .then(() => {
                // Merge panelLogs and userLogs
                // const mergedValues = [...this.state.panelLogs, ...this.state.userLogs];
                //
                // // Sort mergedValues by date
                // mergedValues.sort((a, b) => {
                //     const dateA = moment(a.date, 'HH:mm:ss DD/MM/YYYY');
                //     const dateB = moment(b.date, 'HH:mm:ss DD/MM/YYYY');
                //     return dateA.isBefore(dateB) ? -1 : 1;
                // });
                //
                // this.setState({
                //     tableData: mergedValues,
                // });
            })
        // const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        // await sleep(100) // wait 1 second
        await this.actualize();
        // Merge panelLogs and userLogs
        const mergedValues = [...this.state.panelLogs, ...this.state.userLogs];

        // Sort mergedValues by date
        mergedValues.sort((a, b) => {
            const dateA = moment(a.date, 'DD/MM/YY HH:mm:ss');
            const dateB = moment(b.date, 'DD/MM/YY HH:mm:ss');
            return dateA.isBefore(dateB) ? 1 : -1;
        });

        this.setState({
            tableData: mergedValues,
        });
    }

    ObjectToString(o) {
        Object.keys(o).forEach(k => {
            if (typeof o[k] === 'object') {
                return toString(o[k]);
            }

            o[k] = '' + o[k];
        });

        return o;
    }

    applyDateFilter = (data) => {

        const start = moment(this.state.startDate);
        const end = moment(this.state.endDate);
        return data.filter(log => {
            const date = moment(log.date, 'DD/MM/YY HH:mm:ss');
            return date.isBetween(start, end);
        });
    }

    handleSorting = (sortField, sortOrder) => {
        const mergedValues = [...this.state.panelLogs, ...this.state.userLogs];
        // Sort mergedValues by date
        mergedValues.sort((a, b) => {
            const dateA = moment(a.date, 'DD/MM/YY HH:mm:ss');
            const dateB = moment(b.date, 'DD/MM/YY HH:mm:ss');
            return dateA.isBefore(dateB) ? 1 : -1;
        });
        console.log('mergedValues', mergedValues);
        const filteredData = this.applyDateFilter(mergedValues);

        if (sortField) {
            let sorted;
            if (sortField === "name" || sortField === "username") {
                sorted = [...filteredData].sort((a, b) => {
                    const valueA = a && a[sortField] ? a[sortField] : "";
                    const valueB = b && b[sortField] ? b[sortField] : "";
                    return valueA.localeCompare(valueB) * (sortOrder === "asc" ? 1 : -1);
                });
            } else if (sortField === "date") {
                sorted = [...filteredData].sort((a, b) => {
                    const valueA = a && a[sortField] ? moment(a[sortField], 'DD/MM/YY HH:mm:ss') : "";
                    const valueB = b && b[sortField] ? moment(b[sortField], 'DD/MM/YY HH:mm:ss') : "";
                    return valueA - valueB * (sortOrder === "asc" ? 1 : -1);
                });
            } else if (sortField === "bug" || sortField === "online" || sortField === "door_1" || sortField === "door_2" || sortField === "screen" || sortField === "state") {
                sorted = [...filteredData].sort((a, b) => {
                    const valueA = a && a[sortField] ? a[sortField] : "";
                    const valueB = b && b[sortField] ? b[sortField] : "";
                    return (valueA === valueB ? 0 : valueA ? -1 : 1) * (sortOrder === "asc" ? 1 : -1);
                });
            } else if (sortField === "temperature") {
                sorted = [...filteredData].sort((a, b) => {
                    const valueA
                        = a && a[sortField] ? a[sortField] : "";
                    const valueB = b && b[sortField] ? b[sortField] : "";
                    return Number(valueA) - Number(valueB) * (sortOrder === "asc" ? 1 : -1);
                });
            } else if (sortField === "message") {
                sorted = [...filteredData].sort((a, b) => {
                    const valueA
                        = a && a[sortField] ? a[sortField] : "";
                    const valueB = b && b[sortField] ? b[sortField] : "";
                    return Number(valueA) - Number(valueB) * (sortOrder === "asc" ? 1 : -1);
                });
            }

            this.setState({
                tableData: sorted,
                sortedData: sorted,
            });

            console.log(sorted)

        }
    };

    handleSearchChange = (e) => {
        this.setState({search: e.target.value, currentPage: 1});

        if (e.target.value) {
            this.element.classList.toggle('hidden');
        }

    }

    handleStartDateChange = async (date) => {
        this.setState({
            startDate: date,
            currentPage: 1
        });
        await this.actualize();
    }
    handleEndDateChange = async (date) => {
        this.setState({
            endDate: date,
            currentPage: 1
        });
        await this.actualize();
    }

    handlePageChange = (pageNumber) => {
        this.setState({
            currentPage: pageNumber,
        });
        let url = config.domain_name +"/panelLogs?startDate=" + moment(this.state.startDate).format('DD/MM/YY HH:mm:ss') + "&endDate=" + moment(this.state.endDate).format('DD/MM/YY HH:mm:ss') + '&page=' + this.state.currentPage + '&pageSize=' + this.state.pageSize;
        axios.get(url)
            .then((Reponse) => {
                this.setState({
                    panelLogs: Reponse.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });
        url = config.domain_name +"/userLogs?startDate=" + moment(this.state.startDate).format('DD/MM/YY HH:mm:ss ') + "&endDate=" + moment(this.state.endDate).format('DD/MM/YY HH:mm:ss');

        axios.get(url)
            .then((Reponse) => {
                this.setState({
                    userLogs: Reponse.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });

    }

    handlePageSizeChange = (e) => {
        if (e.target.value != '') {
            this.setState({pageSize: parseInt(e.target.value, 10), currentPage: 1});
        } else {
            this.setState({pageSize: 0, currentPage: 1});
        }
    }

    render() {
        const columns = [
            {label: "Panneau", accessor: "name"},
            {label: "Utilisateur", accessor: "username"},
            {label: "État", accessor: "state"},
            {label: "Date", accessor: "date"},
            {label: "Statut", accessor: "online"},
            {label: "Porte Coffret", accessor: "door_1"},
            {label: "Consommation", accessor: "door_2"},
            {label: "Alimentation", accessor: "screen"},
            {label: "Température", accessor: "temperature"},
            {label: "Action", accessor: "message"},
        ];

        const {search, tableData} = this.state;


        let filteredData = this.state.tableData.length > 0 ? this.state.tableData.filter(log => {
            log.state && console.log(log.state.toString())
            return (
                ('name' in log && log.name.includes(search)) ||
                ('username' in log && log.username.includes(search)) ||
                ('state' in log && log.state.toString().includes(search)) ||
                ('date' in log && log.date.includes(search)) ||
                ('online' in log && log.online.toString().includes(search)) ||
                ('door_1' in log && log.door_1.toString().includes(search)) ||
                ('door_2' in log && log.door_2.toString().includes(search)) ||
                ('screen' in log && log.screen.toString().includes(search)) ||
                ('temperature' in log && log.temperature.toString().includes(search)) ||
                ('message' in log && log.message.includes(search))
            );
        }) : this.state.tableData;

        filteredData = this.applyDateFilter(filteredData);

        const {currentPage, pageSize} = this.state;
        const totalPages = Math.ceil(filteredData.length / pageSize);

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        let currentPageData = filteredData.slice(startIndex, endIndex);
        currentPageData = this.ObjectToString(currentPageData)


        const oldestDate = filteredData.length > 0 ? filteredData.reduce((acc, log) => {
            return moment(log.date, 'DD/MM/YYYY HH:mm:ss').isBefore(acc) ? log.date : acc;
        }, moment(filteredData[0].date), 'DD/MM/YYYY HH:mm:ss ') : moment(new Date(), ' DD/MM/YYYY HH:mm:ss');

        return (
            <div className="table-container">
                <div className="date-picker-container">
                    <div className="pagination-controls">
                        <button onClick={() => this.handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            Page précédente
                        </button>
                    </div>
                    <input type="text" value={search} placeholder="Rechercher un log"
                           onChange={this.handleSearchChange}/>
                    <DatePicker
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Horaire"
                        selected={this.state.startDate}
                        onChange={this.handleStartDateChange}
                        dateFormat='dd/MM/yyyy HH:mm'
                        minDate={oldestDate}
                        defaultValue={oldestDate}
                        maxDate={new Date()}
                    />
                    {/*<button onClick={async () => {*/}
                    {/*    this.setState({loading: true});*/}
                    {/*    await this.actualize();*/}
                    {/*    await this.actualize();*/}
                    {/*    this.setState({loading: false});*/}
                    {/*}}>Rechercher</button>*/}

                    <DatePicker
                        selected={this.state.endDate}
                        onChange={this.handleEndDateChange}
                        dateFormat='dd/MM/yyyy HH:mm'
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Horaire"
                        // minDate={oldestDate}
                        // onChange={date => this.handleDateChange(this.state.startDate, this.target.value)}
                        maxDate={new Date()}
                    />
                    <input type="text" value={pageSize} onChange={this.handlePageSizeChange}/>

                    <div className="pagination-controls">
                        <button onClick={() => this.handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}>
                            Page suivante
                        </button>
                    </div>
                </div>

                {this.state.loading ? (
                    <p style={{textAlign: "center"}} className="blinking loader">Chargement des logs... veuillez
                        patienter.</p>
                ) : (
                    <table className={`table`}>

                        <TableHead columns={columns} handleSorting={this.handleSorting}/>
                        <TableBody columns={columns} tableData={currentPageData}/>
                    </table>

                )}
                <div className="pagination-controls">
                    <button onClick={() => this.handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Page précédente
                    </button>
                    <p>
                        Page {currentPage} sur {totalPages}
                    </p>
                    <button onClick={() => this.handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}>
                        Page suivante
                    </button>
                </div>
            </div>
        );
    }
}

export default Table;