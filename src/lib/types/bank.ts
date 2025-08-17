export interface BankACF {
  bank_image: string
  bank_name: string
  bank_branch_name: string
  bank_account_name: string
  bank_account_number: string
}

export interface BankData {
  acf: BankACF
}