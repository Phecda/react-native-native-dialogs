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

RCT_EXPORT_METHOD(alertWithArgs:(NSDictionary *)args callback:(RCTResponseSenderBlock)callback)
{
    NSString *title = [RCTConvert NSString:args[@"title"]];
    NSString *message = [RCTConvert NSString:args[@"message"]];
    NSArray<NSDictionary *> *buttons = [RCTConvert NSDictionaryArray:args[@"buttons"]];
    NSString *cancelButtonKey = [RCTConvert NSString:args[@"cancelButtonKey"]];
    NSString *destructiveButtonKey = [RCTConvert NSString:args[@"destructiveButtonKey"]];
    
    // TextInput
    NSArray<NSDictionary *> *textFields = [RCTConvert NSDictionaryArray:args[@"textInputs"]];
    
    // Image
    UIImage *image = [RCTConvert UIImage:args[@"image"]];
    
    if (!title && !message) {
        RCTLogError(@"Must specify either an alert title, or message, or both");
        return;
    }
    
    if (buttons.count == 0) {
        if (textFields.count == 0) {
            buttons = @[@{@"0": RCTUIKitLocalizedString(@"OK")}];
            cancelButtonKey = @"0";
        } else {
            buttons = @[
                        @{@"0": RCTUIKitLocalizedString(@"OK")},
                        @{@"1": RCTUIKitLocalizedString(@"Cancel")},
                        ];
            cancelButtonKey = @"1";
        }
    }
    
    UIViewController *presentingController = RCTPresentedViewController();
    if (presentingController == nil) {
        RCTLogError(@"Tried to display alert view but there is no application window. args: %@", args);
        return;
    }
    
    UIAlertController *alertController = [UIAlertController
                                          alertControllerWithTitle:title
                                          message:nil
                                          preferredStyle:UIAlertControllerStyleAlert];
    
    
    alertController.message = message;
    
    for (NSDictionary<NSString *, id> *textFieldConfig in textFields) {
        [alertController addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
            textField.placeholder = [RCTConvert NSString:textFieldConfig[@"placeholder"]];
            textField.text = [RCTConvert NSString:textFieldConfig[@"defaultValue"]];
            textField.keyboardType = [RCTConvert UIKeyboardType:textFieldConfig[@"keyboardType"]];
            textField.secureTextEntry = [RCTConvert BOOL:textFieldConfig[@"secureTextEntry"]];
        }];
    }
    
    if (image != nil) {
        CGSize maxSize = CGSizeMake(270 - 24, 204);

        CGSize imageSize = image.size;
        CGFloat ratio;
        if (imageSize.width > imageSize.height) {
            ratio = maxSize.width / imageSize.width;
        } else {
            ratio = maxSize.height / imageSize.height;
        }

        CGSize scaledSize = CGSizeMake(imageSize.width * ratio, imageSize.height * ratio);

        UIImage* resizedImage = [self resizeImage:image ToSize:scaledSize];

    
        CGFloat left = (maxSize.width - resizedImage.size.width) / 2;

        resizedImage = [resizedImage imageWithAlignmentRectInsets:UIEdgeInsetsMake(0, -left, 0, 0)];
        
        
        UIAlertAction *imageAction = [UIAlertAction actionWithTitle:@"" style:UIAlertActionStyleDefault handler:nil];
        [imageAction setValue:[resizedImage imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal] forKey:@"image"];
        [imageAction setEnabled:NO];

        [alertController addAction:imageAction];
    }
    
    for (NSDictionary<NSString *, id> *button in buttons) {
        if (button.count != 1) {
            RCTLogError(@"Button definitions should have exactly one key.");
        }
        NSString *buttonKey = button.allKeys.firstObject;
        NSString *buttonTitle = [RCTConvert NSString:button[buttonKey]];
        UIAlertActionStyle buttonStyle = UIAlertActionStyleDefault;
        if ([buttonKey isEqualToString:cancelButtonKey]) {
            buttonStyle = UIAlertActionStyleCancel;
        } else if ([buttonKey isEqualToString:destructiveButtonKey]) {
            buttonStyle = UIAlertActionStyleDestructive;
        }
        __weak UIAlertController *weakAlertController = alertController;
        [alertController addAction:[UIAlertAction actionWithTitle:buttonTitle
                                                            style:buttonStyle
                                                          handler:^(__unused UIAlertAction *action) {
                                                              NSMutableArray<NSString*> *arr = [[NSMutableArray alloc] init];
                                                              
                                                              if (textFields.count != 0) {
                                                                  for (UITextField* field in weakAlertController.textFields) {
                                                                      [arr addObject:[field text]];
                                                                  }
                                                                  callback(@[buttonKey, arr]);
                                                              } else {
                                                                  callback(@[buttonKey]);
                                                              }
                                                          }]];
    }
    
    if (!_alertControllers) {
        _alertControllers = [NSHashTable weakObjectsHashTable];
    }
    [_alertControllers addObject:alertController];
    
    [presentingController presentViewController:alertController animated:YES completion:nil];
}

- (UIImage *)decodeBase64ToImage:(NSString *)strEncodeData {
    
    @try {
        NSData *data = [[NSData alloc]initWithBase64EncodedString:strEncodeData options:NSDataBase64DecodingIgnoreUnknownCharacters];
        
        UIImage *image =[UIImage imageWithData:data];
        return image;
    } @catch (NSException *exception) {
        return nil;
    }
    
    
}

- (UIImage *)resizeImage:(UIImage*)source ToSize:(CGSize)size {
    
    CGFloat aspectWidth = size.width / source.size.width;
    CGFloat aspectHeight = size.height / source.size.height;
    CGFloat aspectRatio = aspectWidth > aspectHeight ? aspectHeight : aspectWidth;
    
    CGRect scaledImageRect = CGRectZero;
    scaledImageRect.size.width = source.size.width * aspectRatio;
    scaledImageRect.size.height = source.size.height * aspectRatio;
    scaledImageRect.origin.x = (size.width - scaledImageRect.size.width) / 2.0;
    scaledImageRect.origin.y = (size.height - scaledImageRect.size.height) / 2.0;
    
    UIGraphicsBeginImageContextWithOptions(size, NO, 0);
    
    [source drawInRect:scaledImageRect];
    UIImage* scaledImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return scaledImage;
    
}

@end
