'use client'

import { useState } from 'react'
import Button from '@/components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function SettingsPage() {
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false)
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const handleDeleteAccount = () => {
    if (deleteConfirmText === 'DELETE') {
      console.log('Deleting account...')
      setIsDeleteDialogOpen(false)
      setDeleteConfirmText('')
    }
  }

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your account security and preferences</p>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
        <form className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={currentPasswordVisible ? 'text' : 'password'}
                placeholder="Enter current password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {currentPasswordVisible ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={newPasswordVisible ? 'text' : 'password'}
                placeholder="Enter new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {newPasswordVisible ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
            />
          </div>

          <Button type="submit">
            Update Password
          </Button>
        </form>
      </div>

      {/* Delete Account */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Delete Account</h2>
        <p className="text-gray-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600">
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Account</DialogTitle>
              <DialogDescription className="space-y-3 pt-2">
                <p>
                  This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                </p>
                <p className="font-medium">
                  To confirm deletion, please type <span className="font-mono bg-gray-100 px-2 py-1 rounded">DELETE</span> below:
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                id="confirmDelete"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="font-mono"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setDeleteConfirmText('')
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Permanently Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}