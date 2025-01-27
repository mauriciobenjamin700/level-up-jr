import { Database } from "../model/database";
import { UserModel } from "../model/user-model";
import { PartnerModel } from "../model/partner-model";

export class PartnerService{

    async register(
        name: string, 
        email: string, 
        password: string, 
        company_name: string,
    ){
    
        const conection = Database.getInstance();

        try {
        
            await conection.beginTransaction();


            const user = await UserModel.create({
                name: name,
                email: email,
                password: password
            })
    
            const partner = await PartnerModel.create({
                user_id: user.id,
                company_name: company_name,
            });

            await conection.commit();
    
            return {
                id: partner.id, 
                name: name,
                user_id: user.id, 
                company_name: company_name, 
                created_at: partner.created_at 
            };
        } catch (error) {
            await conection.rollback();
            throw error;
        }



    }

    async findByUserId(userId: number): Promise<any>{
        
        const partner = await PartnerModel.findByUserId(userId);

        return partner;

    }
}