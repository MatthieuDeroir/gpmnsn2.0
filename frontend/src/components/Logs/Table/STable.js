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
            startDate: new Date('00:00:00 10/01/2022'),
            endDate: new Date(),
        };
    }

    async actualize() {
        let url = "http://" + config.ip + ":" + config.port + "/panelLogs";

        await axios.get(url)
            .then((Reponse) => {
                this.setState({
                    panelLogs: Reponse.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });
        url = "http://" + config.ip + ":" + config.port + "/userLogs";

        await axios.get(url)
            .then((Reponse) => {
                this.setState({
                    userLogs: Reponse.data,
                });
            })
            .catch((error) => {
                console.log(error);
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
                //     const dateA = moment(a.date, 'hh:mm:ss DD/MM/YYYY');
                //     const dateB = moment(b.date, 'hh:mm:ss DD/MM/YYYY');
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
            const dateA = moment(a.date, 'hh:mm:ss DD/MM/YYYY');
            const dateB = moment(b.date, 'hh:mm:ss DD/MM/YYYY');
            return dateA.isBefore(dateB) ? 1 : -1;
        });

        this.setState({
            tableData: mergedValues,
        });
    }

    applyDateFilter = (data) => {
        const start = moment(this.state.startDate);
        const end = moment(this.state.endDate);
        return data.filter(log => {
            const date = moment(log.date, 'hh:mm:ss DD/MM/YYYY');
            return date.isBetween(start, end);
        });
    }

    handleSorting = (sortField, sortOrder) => {
        this.actualize();

        const mergedValues = [...this.state.panelLogs, ...this.state.userLogs];
        // Sort mergedValues by date
        mergedValues.sort((a, b) => {
            const dateA = moment(a.date, 'hh:mm:ss DD/MM/YYYY');
            const dateB = moment(b.date, 'hh:mm:ss DD/MM/YYYY');
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
                    const valueA = a && a[sortField] ? moment(a[sortField], 'hh:mm:ss DD/MM/YYYY') : "";
                    const valueB = b && b[sortField] ? moment(b[sortField], 'hh:mm:ss DD/MM/YYYY') : "";
                    return valueA - valueB * (sortOrder === "asc" ? 1 : -1);
                });
            } else if (sortField === "bug" || sortField === "online" || sortField === "door_1" || sortField === "door_2" || sortField === "screen") {
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

    handleStartDateChange = (date) => {
        this.setState({
            startDate: date,
            currentPage: 1
        });
    }
    handleEndDateChange = (date) => {
        this.setState({
            endDate: date,
            currentPage: 1
        });
    }

    handlePageChange = (pageNumber) => {
        this.setState({
            currentPage: pageNumber,
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
            {label: "Date", accessor: "date"},
            {label: "État", accessor: "bug"},
            {label: "Statut", accessor: "online"},
            {label: "Porte Coffret", accessor: "door_1"},
            {label: "Consommation", accessor: "door_2"},
            {label: "Alimentation", accessor: "screen"},
            {label: "Température", accessor: "temperature"},
            {label: "Action", accessor: "message"},
        ];

        const {search, tableData} = this.state;


        let filteredData = this.state.tableData.length > 0 ? this.state.tableData.filter(log => {
            return (
                ('name' in log && log.name.toLowerCase().includes(search.toLowerCase())) ||
                ('username' in log && log.username.toLowerCase().includes(search.toLowerCase())) ||
                ('date' in log && log.date.includes(search)) ||
                ('bug' in log && log.bug.toLowerCase().includes(search.toLowerCase())) ||
                ('online' in log && log.online.toLowerCase().includes(search.toLowerCase())) ||
                ('door_1' in log && log.door_1.toLowerCase().includes(search.toLowerCase())) ||
                ('door_2' in log && log.door_2.toLowerCase().includes(search.toLowerCase())) ||
                ('screen' in log && log.screen.toLowerCase().includes(search.toLowerCase())) ||
                ('temperature' in log && log.temperature.toLowerCase().includes(search.toLowerCase())) ||
                ('message' in log && log.message.toLowerCase().includes(search.toLowerCase()))
            );
        }) : this.state.tableData;

        filteredData = this.applyDateFilter(filteredData);

        const {currentPage, pageSize} = this.state;
        const totalPages = Math.ceil(filteredData.length / pageSize);

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const currentPageData = filteredData.slice(startIndex, endIndex);

        const oldestDate = filteredData.length > 0 ? filteredData.reduce((acc, log) => {
            return moment(log.date, 'HH:mm:ss DD/MM/YYYY').isBefore(acc) ? log.date : acc;
        }, moment(filteredData[0].date), 'HH:mm:ss DD/MM/YYYY') : moment(new Date(), 'HH:mm:ss DD/MM/YYYY');

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
                        selected={this.state.startDate}
                        onChange={this.handleStartDateChange}
                        dateFormat='hh:mm:ss dd/MM/yyyy'
                        minDate={oldestDate}
                        defaultValue={oldestDate}
                        maxDate={new Date()}
                    />
                    <DatePicker
                        selected={this.state.endDate}
                        onChange={this.handleEndDateChange}
                        dateFormat='hh:mm:ss dd/MM/yyyy'
                        // minDate={oldestDate}
                        // onChange={date => this.handleDateChange(this.state.startDate, this.target.value)}
                        maxDate={new Date()}
                    />
                    <input type="text" value={pageSize} onChange={this.handlePageSizeChange}/>

                        <div className="pagination-controls">
                            <button onClick={() => this.handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                Page suivante
                            </button>
                        </div>
                </div>
                <table className={`table`}>
                    <TableHead columns={columns} handleSorting={this.handleSorting}/>
                    <TableBody columns={columns} tableData={currentPageData}/>
                </table>
                    <div className="pagination-controls">
                        <button onClick={() => this.handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            Page précédente
                        </button>
                        <p>
                            Page {currentPage} sur {totalPages}
                        </p>
                        <button onClick={() => this.handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            Page suivante
                        </button>
                    </div>
            </div>
        );
    }
}

export default Table;