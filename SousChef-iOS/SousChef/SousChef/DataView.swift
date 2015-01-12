//
//  DataView.swift
//  SousChef
//
//  Created by Development on 07/01/2015.
//  Copyright (c) 2015 BenAllen. All rights reserved.
//

import UIKit
import Foundation

class DataView: UIViewController {
    
    @IBOutlet weak var messageLabel:UILabel!
    
    override func viewDidLoad() {
        messageLabel.text = "Hello World"
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}