export interface Stone {
  name: string
  nameTh: string
  energy: string
  energyTh: string
}

export interface DIYCreation {
  id: string
  title: string
  titleTh: string
  thumbnail: string
  designerName: string
  designerNameTh: string
  stones: Stone[]
  price: number
  description: string
  descriptionTh: string
  createdAt: string
}