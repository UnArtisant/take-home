import { z } from 'zod'

export const BodySchema = z.object({
  signature: z.string(),
  data: z.record(z.unknown()),
})
