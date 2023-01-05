import sql, {ConnectionPool} from "mssql";
import { config } from "./conf";


class DB {
    public pool2: ConnectionPool;
    public pool2Connect: Promise<ConnectionPool>;
    constructor() {
        this.pool2 = new sql.ConnectionPool(config);
        this.pool2Connect = this.pool2.connect();
    }

    exec(arrayParams: Array<any>,
        nameProcedure: string,
        authorization = null,
        paramsDecode = null,
        setTVP: any = null) {
          return new Promise((resolve, reject) => {
            this.pool2Connect
              .then((pool) => {
                const request = new sql.Request(this.pool2);
                for (var i = 0; i < arrayParams.length; i++) {
                  for (var key in arrayParams[i]) {
                    request.input(key, arrayParams[i][key]);
                  }
                }
                if (setTVP != null) setTVP(sql, request);
        
                request.execute(nameProcedure, (err, result) => {
                
                  if (!err) resolve(result);
                  else reject(err);
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
    }
}
const db = new DB()
export default db