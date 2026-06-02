import { z } from "zod"

const updateMobileStatusSchema = z.object({
  maintenanceEnabled: z.boolean(),
  title: z.string().trim().min(1).max(80).optional(),
  message: z.string().trim().min(1).max(320).optional(),
})

type UpdateMobileStatusDto = z.infer<typeof updateMobileStatusSchema>

export { updateMobileStatusSchema }
export type { UpdateMobileStatusDto }
