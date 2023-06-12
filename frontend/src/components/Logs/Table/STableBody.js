import moment from 'moment';

const TableBody = ({ tableData, columns }) => {
    return (

        <tbody>
        {/*'name' in log*/}
        {/*'username' in*/}
        {/*'date' in log*/}
        {/*'bug' in log*/}
        {/*'online' in l*/}
        {/*'door_1' in l*/}
        {/*'door_2' in l*/}
        {/*'screen' in l*/}
        {/*'temperature'*/}
        {/*'message' in*/}
        {/*<TableCell align="right">{row.state ? "Allumé" : "Éteint"}</TableCell>*/}
        {/*<TableCell align="right">{!row.power ? "En ligne" : "Hors ligne"}</TableCell>*/}
        {/*<TableCell align="right">{row.door_1 ? "Ouvertes" : "Fermées"}</TableCell>*/}
        {/*<TableCell align="right">{row.door_2 ? "Ouvertes" : "Fermées"}</TableCell>*/}
        {/*<TableCell align="right">{row.screen ? "En état" : "Défaut Alimentation"}</TableCell>*/}
        {tableData.map((data) => {
                return (
                    <tr key={data._id}>
                        {columns.map(({ accessor }) => {
                            if (accessor == 'date'){
                                const tData = data[accessor] ? moment(data[accessor], 'DD/MM/YY HH:mm:ss').format('HH:mm:ss DD/MM/YY') : "——";
                                return <td key={accessor}>{tData}</td>;
                            }
                            if (accessor == 'name' || accessor == 'username' || accessor == 'message'){
                                const tData = data[accessor] ? data[accessor].toString() : "——";
                                return <td key={accessor}>{tData}</td>;
                            }
                            else if (accessor == 'temperature'){
                                const tData = data[accessor] ? data[accessor].toString().split('.') : "——";
                                return <td key={accessor}>{tData[0] + "°C"}</td>;
                            }
                            else if (accessor == 'state'){
                                const tData = data[accessor] == false || data[accessor] == true? (data[accessor].toString() === 'true' ? "Allumé" : "Éteint") : "——";
                                return <td key={accessor}>{tData}</td>;
                            }
                            else if (accessor == 'online'){
                                    const tData = data[accessor] == false || data[accessor] == true? (data[accessor].toString() === 'true' ? "Hors Ligne" : "En Ligne") : "——";
                                    return <td key={accessor}>{tData}</td>;
                            }
                            else if (accessor == 'screen'){
                                const tData = data[accessor] == false || data[accessor] == true ? data[accessor].toString() === 'true' ? "En État" : "Défaut Alimentation" : "——";
                                return <td key={accessor}>{tData}</td>;
                            }
                            else if (accessor == 'door_1'){
                                const tData = data[accessor] == false || data[accessor] == true ? data[accessor].toString() === 'true' ? "Ouverte" : "Fermée" : "——";
                                return <td key={accessor}>{tData}</td>;
                            }
                            else if (accessor == 'door_2'){
                                const tData = data[accessor] == false || data[accessor] == true ? data[accessor].toString() === 'true' ? "Défaut Secteur" : "En État" : "——";
                                return <td key={accessor}>{tData}</td>;
                            }
                            else {
                                return "?"
                            }
                        })}
                    </tr>
                );
            })}
        </tbody>
    );
};

export default TableBody;