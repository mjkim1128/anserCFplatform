import { Request, Response } from "express";

class IndexController {
    public async getIndex(req: Request, res: Response): Promise<void> {
        try {
            // Logic to interact with the database and retrieve data
            res.status(200).json({ message: "Welcome to the Index!" });
        } catch (error) {
            res.status(500).json({ error: "An error occurred while fetching data." });
        }
    }
}

export default IndexController;