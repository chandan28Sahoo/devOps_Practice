// import { RESPONSES } from '../constant/response';

class ResponseHelper {
  public success(response: any, status: number, responseData: any = {}) {
    return response.status(status).send(responseData);
  }

  public error(response: any, status: number, responseData: any = {}) {
    return response.status(status).send(responseData);
  }
}
export default new ResponseHelper();
