import { inventoryAnalyzeService } from "../service/inventory.service.js";

export function inventoryAnalyzeController(req, res) {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                error: "No file uploaded"
            })
        }
        const result = inventoryAnalyzeService(file);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: e.message,
        })

    }
}