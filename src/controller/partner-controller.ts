import { Router } from "express";
import { PartnerService } from "../services/partner-service";
import { EventService } from "../services/event-service";

export const partnersRoutes = Router();


partnersRoutes.post("/register", async (req, res) => {
    const { name, email, password, company_name } = req.body;
    
    const partnerService = new PartnerService();

    const partner = await partnerService.register(name, email, password, company_name);

    res.status(201).json(partner);

});

partnersRoutes.post("/events", async (req, res): Promise<any> => {
    const { name, description, date, location} = req.body;

    const userId = req.user!.id;


    const partnerService = new PartnerService();

    const partner = await partnerService.findByUserId(
        userId
    );

    if (!partner){
        return res.status(403).json({message: "Not authorized"});
    }

    const eventService = new EventService();
    const result = await eventService.create({
        name: name,
        description: description,
        date: date,
        location: location,
        partnerId: partner.id
    });

    res.status(201).json(result);

});

partnersRoutes.get("/events", async (req, res): Promise<any> =>  {

    const userId = req.user!.id;


    const partnerService = new PartnerService();

    const partner = await partnerService.findByUserId(
        userId
    );

    if (!partner){
        return res.status(403).json({message: "Not authorized"});
    }

    const eventService = new EventService();

    const result = await eventService.findAll(partner.id);


    res.status(200).json(result);


});

partnersRoutes.get("/events/:id", async (req, res): Promise<any> => {

    const userId = req.user!.id;

    const eventId = req.params.id

    const partnerService = new PartnerService();

    const partner = await partnerService.findByUserId(
        userId
    );

    if (!partner){
        return res.status(403).json({message: "Not authorized"});
    }

    const eventService = new EventService();
    const event = await eventService.findById(+eventId);

    if (!event || event.partner_id !== partner.id){
        return res.status(404).json({message: "Event not found"});
    }

    res.status(200).json(event);

});