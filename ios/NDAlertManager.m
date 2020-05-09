#import "NDAlertManager.h"

#import <React/RCTAssert.h>
#import <React/RCTConvert.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>

@interface NDAlertManager()

@end

@implementation NDAlertManager
{
    NSHashTable *_alertControllers;
    __weak UIAlertAction* _submitAction;
}

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (void)invalidate {
    for (UIAlertController * alertController in _alertControllers) {
        [alertController.presentingViewController dismissViewControllerAnimated:YES completion:nil];
    }
}

RCT_EXPORT_METHOD(alertWithArgs :(NSDictionary *)args
                  :(RCTPromiseResolveBlock)resolve
                  :(RCTPromiseRejectBlock)reject)
{
    NSString *title = [RCTConvert NSString:args[@"title"]];
    NSString *message = [RCTConvert NSString:args[@"message"]];
    
    if (!title && !message) {
        RCTLogError(@"Must specify either an alert title, or message, or both");
        return;
    }
    
    BOOL submitDestructive = args[@"submitDestructive"] ? [RCTConvert BOOL:args[@"submitDestructive"]] : NO;
    BOOL allowEmptyInput = args[@"allowEmptyInput"] ? [RCTConvert BOOL:args[@"allowEmptyInput"]] : YES;
    
    NSString* defaultValue = [RCTConvert NSString:args[@"defaultValue"]];
    
    UIViewController *presentingController = RCTPresentedViewController();
    if (presentingController == nil) {
        RCTLogError(@"Tried to display alert view but there is no application window. args: %@", args);
        return;
    }
    
    UIAlertController *alertController = [UIAlertController
                                          alertControllerWithTitle:title
                                          message:message
                                          preferredStyle:UIAlertControllerStyleAlert];
    
    [alertController addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
        textField.placeholder = [RCTConvert NSString:args[@"placeholder"]];
        textField.text = defaultValue;
        textField.keyboardType = [RCTConvert UIKeyboardType:args[@"keyboardType"]];
        textField.secureTextEntry = [RCTConvert BOOL:args[@"secureTextEntry"]];
        [textField addTarget:self action:@selector(onTextChanged:) forControlEvents:UIControlEventEditingChanged];
    }];
    
    NSString* submitText = [RCTConvert NSString:args[@"submitText"]] ?: RCTUIKitLocalizedString(@"OK");
    NSString* cancelText = [RCTConvert NSString:args[@"cancelText"]] ?: RCTUIKitLocalizedString(@"Cancel");
    
    __weak UIAlertController* weakAlertController = alertController;
    
    UIAlertAction* submitAction = [UIAlertAction actionWithTitle:submitText style:submitDestructive ? UIAlertActionStyleDestructive : UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        resolve([weakAlertController.textFields.firstObject text]);
    }];
    
    if (!allowEmptyInput) {
        _submitAction = submitAction;
        if ([defaultValue length] == 0){
            [submitAction setEnabled: NO];
        }
    }
    
    
    UIAlertAction* cancelAction = [UIAlertAction actionWithTitle:cancelText style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        reject(@"", @"", nil);
    }];
    
    [alertController addAction:submitAction];
    [alertController addAction:cancelAction];
    
    if (!_alertControllers) {
        _alertControllers = [NSHashTable weakObjectsHashTable];
    }
    [_alertControllers addObject:alertController];
    
    [presentingController presentViewController:alertController animated:YES completion:nil];
}

- (void)onTextChanged: (UITextField*)sender
{
    [_submitAction setEnabled:[sender.text length] != 0];
}

@end
