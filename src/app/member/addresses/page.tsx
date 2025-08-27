'use client'

import { useState } from 'react'
import Button from '@/components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Address {
  id: string
  name: string
  phone: string
  address: string
  subDistrict: string
  district: string
  province: string
  postalCode: string
  isDefault: boolean
}

export default function AddressesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '+66 81 234 5678',
      address: '123 Sukhumvit Road',
      subDistrict: 'Khlong Toei',
      district: 'Khlong Toei',
      province: 'Bangkok',
      postalCode: '10110',
      isDefault: true,
    },
    {
      id: '2',
      name: 'John Doe',
      phone: '+66 81 234 5678',
      address: '456 Rama IV Road',
      subDistrict: 'Pathum Wan',
      district: 'Pathum Wan',
      province: 'Bangkok',
      postalCode: '10330',
      isDefault: false,
    },
  ])

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: '',
  })

  const handleAddAddress = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      subDistrict: '',
      district: '',
      province: '',
      postalCode: '',
    })
    setEditingAddress(null)
    setIsAddModalOpen(true)
  }

  const handleEditAddress = (address: Address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      subDistrict: address.subDistrict,
      district: address.district,
      province: address.province,
      postalCode: address.postalCode,
    })
    setEditingAddress(address)
    setIsAddModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id 
          ? { ...addr, ...formData }
          : addr
      ))
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0,
      }
      setAddresses([...addresses, newAddress])
    }
    setIsAddModalOpen(false)
  }

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
  }

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id))
  }

  return (
    <div className="max-w-7xl mx-auto pt-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Addresses</h1>
          <p className="text-gray-600">Manage your shipping addresses</p>
        </div>
        <Button onClick={handleAddAddress}>
          Add New Address
        </Button>
      </div>

      {/* Address Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {address.isDefault && (
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mb-3">
                Default Address
              </span>
            )}
            
            <div className="space-y-2 mb-4">
              <p className="font-semibold text-gray-900">{address.name}</p>
              <p className="text-gray-600">{address.phone}</p>
              <p className="text-gray-600">
                {address.address}<br />
                {address.subDistrict}, {address.district}<br />
                {address.province} {address.postalCode}
              </p>
            </div>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEditAddress(address)}
              >
                Edit
              </Button>
              {!address.isDefault && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set as Default
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h3>
          <p className="text-gray-500 mb-6">Add your first delivery address to get started.</p>
          <Button onClick={handleAddAddress}>
            Add Address
          </Button>
        </div>
      )}

      {/* Add/Edit Address Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="House number, street name"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subDistrict">Sub-district</Label>
                <Input
                  id="subDistrict"
                  type="text"
                  value={formData.subDistrict}
                  onChange={(e) => setFormData({ ...formData, subDistrict: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingAddress ? 'Update Address' : 'Add Address'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}