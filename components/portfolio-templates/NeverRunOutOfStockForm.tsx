"use client";

import React, { useState } from "react";
import { useFormStates } from "@/hooks/useFormStates";
import { usePortfolioSubmit } from "@/hooks/usePortfolioSubmit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Package, TrendingUp, Mail, Phone, Building2, Hash, DollarSign } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StockFormData {
  // Product Information
  productName: string;
  productSKU: string;
  currentStock: number;
  minimumThreshold: number;
  reorderQuantity: number;
  unitCost: number;
  
  // Supplier Information
  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;
  
  // Notification Settings
  notificationEmail: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  
  // Additional Settings
  notes: string;
  category: string;
}

interface NeverRunOutOfStockFormProps {
  siteName: string;
}

export default function NeverRunOutOfStockForm({ siteName }: NeverRunOutOfStockFormProps) {
  const { state, setProcessing, setSuccess, setError, reset } = useFormStates();
  const { submit, loading, result } = usePortfolioSubmit(siteName);
  
  const [formData, setFormData] = useState<StockFormData>({
    productName: '',
    productSKU: '',
    currentStock: 0,
    minimumThreshold: 10,
    reorderQuantity: 50,
    unitCost: 0,
    supplierName: '',
    supplierEmail: '',
    supplierPhone: '',
    notificationEmail: '',
    urgencyLevel: 'medium',
    notes: '',
    category: 'general',
  });

  const handleInputChange = (name: keyof StockFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.productName || !formData.notificationEmail || !formData.supplierEmail) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.minimumThreshold >= formData.currentStock) {
      setError('Current stock should be higher than minimum threshold for this setup');
      return;
    }

    setProcessing();

    try {
      const response = await submit(formData);
      
      if (response.success) {
        setSuccess();
      } else {
        setError(response.message || 'Something went wrong');
      }
    } catch (error) {
      setError('Failed to set up stock monitoring');
    }
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      productSKU: '',
      currentStock: 0,
      minimumThreshold: 10,
      reorderQuantity: 50,
      unitCost: 0,
      supplierName: '',
      supplierEmail: '',
      supplierPhone: '',
      notificationEmail: '',
      urgencyLevel: 'medium',
      notes: '',
      category: 'general',
    });
    reset();
  };

  // Success State
  if (state === 'success') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl mb-4">Stock Monitoring Active! 📦</CardTitle>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700 mb-2">
              <strong>{formData.productName}</strong> is now being monitored!
            </p>
            <div className="text-sm space-y-1">
              <p>📊 Current Stock: <strong>{formData.currentStock} units</strong></p>
              <p>⚠️ Alert Threshold: <strong>{formData.minimumThreshold} units</strong></p>
              <p>📧 Notifications: <strong>{formData.notificationEmail}</strong></p>
              <p>🏪 Supplier: <strong>{formData.supplierName}</strong></p>
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            You&apos;ll receive automated alerts when stock runs low, along with supplier contact information and recommended reorder quantities.
          </p>

          <div className="flex gap-3 justify-center">
            <Button onClick={resetForm} variant="outline">
              Monitor Another Product
            </Button>
            <Button onClick={resetForm}>
              Add More Products
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Processing State
  if (state === 'processing') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <CardTitle className="text-2xl mb-4">Setting Up Stock Monitoring...</CardTitle>
          <p className="text-muted-foreground">
            Configuring automated stock alerts for {formData.productName}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Error State
  if (state === 'error') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl mb-4">Setup Failed</CardTitle>
          
          <Alert variant="destructive" className="mb-6 text-left">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {result?.message || 'Failed to set up stock monitoring'}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button onClick={() => reset()} className="w-full">
              Try Again
            </Button>
            <Button onClick={resetForm} variant="outline" className="w-full">
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main Form
  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Package className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-bold">Never Run Out of Stock Again!</h3>
        </div>
        <p className="text-muted-foreground">
          Set up automated stock monitoring with smart alerts and supplier notifications
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Product Information</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="e.g., Premium Coffee Beans"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="productSKU">Product SKU</Label>
              <Input
                id="productSKU"
                value={formData.productSKU}
                onChange={(e) => handleInputChange('productSKU', e.target.value)}
                placeholder="e.g., PCB-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="currentStock">Current Stock</Label>
              <Input
                id="currentStock"
                type="number"
                value={formData.currentStock}
                onChange={(e) => handleInputChange('currentStock', parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
            
            <div>
              <Label htmlFor="minimumThreshold">Alert Threshold *</Label>
              <Input
                id="minimumThreshold"
                type="number"
                value={formData.minimumThreshold}
                onChange={(e) => handleInputChange('minimumThreshold', parseInt(e.target.value) || 0)}
                min="1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="reorderQuantity">Reorder Quantity</Label>
              <Input
                id="reorderQuantity"
                type="number"
                value={formData.reorderQuantity}
                onChange={(e) => handleInputChange('reorderQuantity', parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unitCost">Unit Cost ($)</Label>
              <Input
                id="unitCost"
                type="number"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) => handleInputChange('unitCost', parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="food">Food & Beverages</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="office">Office Supplies</SelectItem>
                  <SelectItem value="raw-materials">Raw Materials</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Supplier Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Supplier Information</h4>
          </div>
          
          <div>
            <Label htmlFor="supplierName">Supplier Name</Label>
            <Input
              id="supplierName"
              value={formData.supplierName}
              onChange={(e) => handleInputChange('supplierName', e.target.value)}
              placeholder="e.g., ABC Supply Co."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplierEmail">Supplier Email *</Label>
              <Input
                id="supplierEmail"
                type="email"
                value={formData.supplierEmail}
                onChange={(e) => handleInputChange('supplierEmail', e.target.value)}
                placeholder="orders@supplier.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="supplierPhone">Supplier Phone</Label>
              <Input
                id="supplierPhone"
                type="tel"
                value={formData.supplierPhone}
                onChange={(e) => handleInputChange('supplierPhone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Notification Settings</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="notificationEmail">Your Email for Alerts *</Label>
              <Input
                id="notificationEmail"
                type="email"
                value={formData.notificationEmail}
                onChange={(e) => handleInputChange('notificationEmail', e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="urgencyLevel">Alert Priority</Label>
              <Select value={formData.urgencyLevel} onValueChange={(value: any) => handleInputChange('urgencyLevel', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low - Daily digest</SelectItem>
                  <SelectItem value="medium">🟡 Medium - Immediate alert</SelectItem>
                  <SelectItem value="high">🔴 High - Urgent + SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Any special instructions, seasonal considerations, or supplier notes..."
            rows={3}
          />
        </div>

        {/* Smart Summary */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Smart Setup Summary</h5>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p>📦 <strong>{formData.productName || 'Your product'}</strong> will be monitored</p>
            <p>⚠️ Alert when stock drops below <strong>{formData.minimumThreshold} units</strong></p>
            <p>💰 Estimated reorder cost: <strong>${(formData.unitCost * formData.reorderQuantity).toFixed(2)}</strong></p>
            <p>📧 Notifications sent to <strong>{formData.notificationEmail || 'your email'}</strong></p>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg py-6"
          size="lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Setting Up Monitoring...
            </>
          ) : (
            <>
              <TrendingUp className="h-5 w-5 mr-2" />
              Activate Stock Monitoring 🚀
            </>
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Automated stock alerts will be active within minutes!
          <br />
          <span className="text-xs">
            💡 Using site: {siteName} | Powered by n8n automation
          </span>
        </div>
      </form>
    </div>
  );
}