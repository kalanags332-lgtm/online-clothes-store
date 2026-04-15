import { describe, it, expect, vi } from "vitest"
import { getProductPrice, getPricesForVariant } from "../get-product-price"

// Mock dependencies
vi.mock("../money", () => ({
  convertToLocale: vi.fn(({ amount }) => `$${amount}`),
}))

vi.mock("../get-percentage-diff", () => ({
  getPercentageDiff: vi.fn(() => "10"),
}))

describe("get-product-price utilities", () => {
  describe("getPricesForVariant", () => {
    it("should return correct price structure for a variant with calculated price", () => {
      const variant = {
        calculated_price: {
          calculated_amount: 100,
          original_amount: 120,
          currency_code: "usd",
          calculated_price: {
            price_list_type: "sale",
          },
        },
      }

      const result = getPricesForVariant(variant)

      expect(result).toEqual({
        calculated_price_number: 100,
        calculated_price: "$100",
        original_price_number: 120,
        original_price: "$120",
        currency_code: "usd",
        price_type: "sale",
        percentage_diff: "10",
      })
    })

    it("should handle missing nested calculated_price object (defensive check fix)", () => {
      const variant = {
        calculated_price: {
          calculated_amount: 100,
          original_amount: 100,
          currency_code: "usd",
          // calculated_price inner object is missing
        },
      }

      // This would have crashed before the fix
      const result = getPricesForVariant(variant)

      expect(result?.price_type).toBe("default")
    })

    it("should handle 0 amount correctly (fix for falsy check)", () => {
      const variant = {
        calculated_price: {
          calculated_amount: 0,
          original_amount: 0,
          currency_code: "usd",
        },
      }

      const result = getPricesForVariant(variant)

      expect(result).not.toBeNull()
      expect(result?.calculated_price_number).toBe(0)
    })

    it("should return null if calculated_price is missing entirely", () => {
      const variant = {}

      const result = getPricesForVariant(variant)

      expect(result).toBeNull()
    })

    it("should return null if calculated_amount is null or undefined", () => {
      const variant = {
        calculated_price: {
          calculated_amount: null,
        }
      }

      const result = getPricesForVariant(variant)

      expect(result).toBeNull()
    })
  })

  describe("getProductPrice", () => {
    it("should return the cheapest price from variants", () => {
      const product = {
        id: "prod_1",
        variants: [
          {
            id: "v1",
            calculated_price: {
              calculated_amount: 200,
              currency_code: "usd",
            },
          },
          {
            id: "v2",
            calculated_price: {
              calculated_amount: 100,
              currency_code: "usd",
            },
          },
        ],
      } as any

      const { cheapestPrice } = getProductPrice({ product })

      expect(cheapestPrice?.calculated_price_number).toBe(100)
    })

    it("should return null if product has no variants with prices", () => {
      const product = {
        id: "prod_1",
        variants: [
          {
            id: "v1",
            calculated_price: null
          }
        ]
      } as any

      const { cheapestPrice } = getProductPrice({ product })

      expect(cheapestPrice).toBeNull()
    })

    it("should return variant-specific price if variantId is provided", () => {
      const product = {
        id: "prod_1",
        variants: [
          {
            id: "v1",
            calculated_price: {
              calculated_amount: 200,
              currency_code: "usd",
            },
          },
          {
            id: "v2",
            calculated_price: {
              calculated_amount: 100,
              currency_code: "usd",
            },
          },
        ],
      } as any

      const { variantPrice } = getProductPrice({ product, variantId: "v1" })

      expect(variantPrice?.calculated_price_number).toBe(200)
    })
  })
})
