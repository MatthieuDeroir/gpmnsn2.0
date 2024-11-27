
// src/actions/logActions.js

import axiosInstance from '../api/axiosInstance';
import { FETCH_LOGS_SUCCESS, FETCH_LOGS_FAILURE } from './actionTypes';

export const fetchLogsSuccess = (logs) => ({
    type: FETCH_LOGS_SUCCESS,
    payload: logs,
});

export const fetchLogsFailure = (error) => ({
    type: FETCH_LOGS_FAILURE,
    payload: error,
});

export const fetchLogs = (panelOrRole, selectedType, page, limit, startDate, endDate, searchQuery) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get(
                `/api/logs/${panelOrRole}/${selectedType}`,
                {
                    params: {
                        page,
                        limit,
                        startDate,
                        endDate,
                        search: searchQuery,
                    },
                }
            );

            console.log('Fetched logs:', response.data);
            dispatch(fetchLogsSuccess(response.data));
        } catch (error) {
            dispatch(fetchLogsFailure(error));
        }
    };
};
