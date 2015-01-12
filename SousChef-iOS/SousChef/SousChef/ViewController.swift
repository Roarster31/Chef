//
//  ViewController.swift
//  SousChef
//
//  Created by Development on 06/01/2015.
//  Copyright (c) 2015 BenAllen. All rights reserved.
//

import UIKit
import AVFoundation
import Foundation

class ViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate {
    
    @IBOutlet weak var messageLabel:UILabel!
    
    var captureSession:AVCaptureSession?
    var videoPreviewLayer:AVCaptureVideoPreviewLayer?
    var qrCodeFrameView:UIView?
    var serverIP:String?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Initial Vars
        serverIP = "smithyproductions.noip.me"
        
        // Do any additional setup after loading the view, typically from a nib.
        // Get an instance of the AVCaptureDevice class to initialize a device object and provide the video
        // as the media type parameter.
        let captureDevice = AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo)
        
        // Get an instance of the AVCaptureDeviceInput class using the previous device object.
        var error:NSError?
        let input: AnyObject! = AVCaptureDeviceInput.deviceInputWithDevice(captureDevice, error: &error)
        
        if (error != nil) {
            // If any error occurs, simply log the description of it and don't continue any more.
            println("\(error?.localizedDescription)")
            return
        }
        
        // Initialize the captureSession object.
        captureSession = AVCaptureSession()
        // Set the input device on the capture session.
        captureSession?.addInput(input as AVCaptureInput)
        
        // Initialize a AVCaptureMetadataOutput object and set it as the output device to the capture session.
        let captureMetadataOutput = AVCaptureMetadataOutput()
        captureSession?.addOutput(captureMetadataOutput)
        
        /*
        // Set delegate and use the default dispatch queue to execute the call back
//        captureMetadataOutput.setMetadataObjectsDelegate(self, queue: dispatch_get_main_queue())
//        captureMetadataOutput.metadataObjectTypes = [AVMetadataObjectTypeEAN13Code]
        */
        
        // Set delegate and use the default dispatch queue to execute the call back
        captureMetadataOutput.setMetadataObjectsDelegate(self, queue: dispatch_get_main_queue())
        captureMetadataOutput.metadataObjectTypes = [AVMetadataObjectTypeQRCode]
        
        // Initialize the video preview layer and add it as a sublayer to the viewPreview view's layer.
        videoPreviewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        videoPreviewLayer?.videoGravity = AVLayerVideoGravityResizeAspectFill
        videoPreviewLayer?.frame = view.layer.bounds
        view.layer.addSublayer(videoPreviewLayer)
        
        // Start video capture.
        captureSession?.startRunning()

        // Move the message label to the top view
        view.bringSubviewToFront(messageLabel)
        
        // Initialize QR Code Frame to highlight the QR code
        qrCodeFrameView = UIView()
        qrCodeFrameView?.layer.borderColor = UIColor.greenColor().CGColor
        qrCodeFrameView?.layer.borderWidth = 2
        view.addSubview(qrCodeFrameView!)
        view.bringSubviewToFront(qrCodeFrameView!)

        getEANDetails("9780230579835")
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func captureOutput(captureOutput: AVCaptureOutput!, didOutputMetadataObjects metadataObjects: [AnyObject]!, fromConnection connection: AVCaptureConnection!) {
        
        // Check if the metadataObjects array is not nil and it contains at least one object.
        if metadataObjects == nil || metadataObjects.count == 0 {
            qrCodeFrameView?.frame = CGRectZero
            messageLabel.text = "No QR code is detected"
            return
        }
        
        // Get the metadata object.
        let metadataObj = metadataObjects[0] as AVMetadataMachineReadableCodeObject
        
//        if metadataObj.type == AVMetadataObjectTypeEAN13Code {
        if metadataObj.type == AVMetadataObjectTypeQRCode {
            // If the found metadata is equal to the QR code metadata then update the status label's text and set the bounds
            let barCodeObject = videoPreviewLayer?.transformedMetadataObjectForMetadataObject(metadataObj as AVMetadataMachineReadableCodeObject) as AVMetadataMachineReadableCodeObject
            qrCodeFrameView?.frame = barCodeObject.bounds;
            
            if metadataObj.stringValue != nil {
                messageLabel.text = metadataObj.stringValue
            }
        }
        
        let barCodeObject = videoPreviewLayer?.transformedMetadataObjectForMetadataObject(metadataObj as AVMetadataMachineReadableCodeObject) as AVMetadataMachineReadableCodeObject
        
        qrCodeFrameView?.frame = barCodeObject.bounds
    }
    func getEANDetails(eanCode: String){
        
        // Check EAN is not blank
        if (eanCode != ""){
            
            // Send to server
            let url = NSURL(string: "http://" + serverIP! + ":6128?ean=")
            var responseDataAsString:String?
            let task = NSURLSession.sharedSession().dataTaskWithURL(url!) {(data, response, error) in
                println(NSString(data: data, encoding: NSUTF8StringEncoding))
                
                // Show as string
                responseDataAsString = NSString(data: data, encoding: NSUTF8StringEncoding)
                self.messageLabel.text = responseDataAsString
                
                // JSON decode
                var error: NSError?
                let productDict = NSJSONSerialization.JSONObjectWithData(data, options: nil, error: &error) as NSDictionary
                
                // Test to see whether the data was received as expected
                if (productDict.count > 0 && productDict.count > 0){
                    
                    // Test to see whether there was an error
                    var responseErrors: NSArray = productDict["errors"] as NSArray
                    if(responseErrors[0] as NSString == "errors"){
                        println("No Product Found")
                    } else {
                        // All ok
                        let viewController:UIViewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewControllerWithIdentifier("dataViewController") as UIViewController
                        // .instantiatViewControllerWithIdentifier() returns AnyObject! this must be downcast to utilize it
                        
                        self.presentViewController(viewController, animated: false, completion: nil)
                    }
                    
                }
                
                
            }
           
            task.resume()
        }
        
    }

}

