import userRoutes from './userRoutes';
import logsRoutes from './logsRoutes';
import panelRoutes from './panelRoutes';
import authRoutes from './authRoutes';
import instructionRoutes from './instructionRoutes';

export default (app) => {
    userRoutes(app);
    logsRoutes(app);
    panelRoutes(app);
    authRoutes(app);
};
