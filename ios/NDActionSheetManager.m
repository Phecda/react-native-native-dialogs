#import "NDActionSheetManager.h"

#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTLog.h>
#import <React/RCTUIManager.h>
#import <React/RCTUtils.h>

@implementation RCTConvert (NDActionSheetTextAlignment)

RCT_ENUM_CONVERTER(NDActionTextAlignment, (@{
                                            @"left": @(NDActionTextAlignmentLeft),
                                            @"center": @(NDActionTextAlignmentCenter),
                                            @"right": @(NDActionTextAlignmentRight)
                                            }), NDActionTextAlignmentCenter, integerValue)

@end

@interface NDActionSheetManager() <UIActionSheetDelegate>
@end

@implementation NDActionSheetManager
{
    // Use NSMapTable, as UIAlertViews do not implement <NSCopying>
    // which is required for NSDictionary keys
    NSMapTable *_callbacks;
}

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

/*
 * The `anchor` option takes a view to set as the anchor for the share
 * popup to point to, on iPads running iOS 8. If it is not passed, it
 * defaults to centering the share popup on screen without any arrows.
 */
- (CGRect)sourceRectInView:(UIView *)sourceView
             anchorViewTag:(NSNumber *)anchorViewTag
{
    if (anchorViewTag) {
        UIView *anchorView = [self.bridge.uiManager viewForReactTag:anchorViewTag];
        return [anchorView convertRect:anchorView.bounds toView:sourceView];
    } else {
        return (CGRect){sourceView.center, {1, 1}};
    }
}

RCT_EXPORT_METHOD(showActionSheetWithOptions:(NSDictionary *)options
                  callback:(RCTResponseSenderBlock)callback)
{
    if (RCTRunningInAppExtension()) {
        RCTLogError(@"Unable to show action sheet from app extension");
        return;
    }
    
    if (!_callbacks) {
        _callbacks = [NSMapTable strongToStrongObjectsMapTable];
    }
    
    NSString *title = [RCTConvert NSString:options[@"title"]];
    NSString *message = [RCTConvert NSString:options[@"message"]];
    
    BOOL cancelable = options[@"cancelable"] ? [RCTConvert BOOL:options[@"cancelable"]] : YES;
    NSString *cancelText = [RCTConvert NSString:options[@"cancelText"]];
    
    NSArray<NSString *> *buttons = [RCTConvert NSStringArray:options[@"options"]];
    
    NSArray<NSDictionary *> *icons = [RCTConvert NSDictionaryArray:options[@"icons"]];
    BOOL tintIcons = options[@"tintIcons"] ? [RCTConvert BOOL:options[@"tintIcons"]] : YES;
    
    NDActionTextAlignment textAlign = options[@"textAlign"] ? [RCTConvert NDActionTextAlignment:options[@"textAlign"]] : NDActionTextAlignmentCenter;
    
    NSInteger destructiveButtonIndex = options[@"destructiveButtonIndex"] ? [RCTConvert NSInteger:options[@"destructiveButtonIndex"]] : -1;
    
    NSInteger selectedIndex = options[@"selectedIndex"] ? [RCTConvert NSInteger:options[@"selectedIndex"]] : -1;
    
    
    UIViewController *controller = RCTPresentedViewController();
    
    if (controller == nil) {
        RCTLogError(@"Tried to display action sheet but there is no application window. options: %@", options);
        return;
    }
    
    /*
     * The `anchor` option takes a view to set as the anchor for the share
     * popup to point to, on iPads running iOS 8. If it is not passed, it
     * defaults to centering the share popup on screen without any arrows.
     */
    NSNumber *anchorViewTag = [RCTConvert NSNumber:options[@"anchor"]];
    UIView *sourceView = controller.view;
    CGRect sourceRect = [self sourceRectInView:sourceView anchorViewTag:anchorViewTag];
    
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:title message:message preferredStyle:UIAlertControllerStyleActionSheet];
    
    NSInteger index = 0;
    for (NSString *option in buttons) {
        
        NSString* buttonTitle = option;
        
        UIAlertActionStyle style = UIAlertActionStyleDefault;
        if (index == destructiveButtonIndex) {
            style = UIAlertActionStyleDestructive;
        }
        
        NSInteger localIndex = index;
        
        UIAlertAction *action = [UIAlertAction actionWithTitle:buttonTitle style:style handler:^(UIAlertAction * _Nonnull action) {
            callback(@[@(localIndex)]);
        }];
        
        if (index < icons.count) {
            UIImage *iconImage = [self iconImageFromDictionary:icons[index]];
            if (iconImage) {
              if (!tintIcons) {
                iconImage = [iconImage imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
              }
              [action setValue:iconImage forKey:@"image"];
            }
        }
        
        [action setValue:@(textAlign) forKey:@"titleTextAlignment"];
        
        if (localIndex == selectedIndex) {
            [action setValue:@true forKey:@"checked"];
        }
        
        [alertController addAction:action];
        
        index++;
    }
    
    if (cancelable) {
        NSString* buttonTitle = cancelText;
        if (!buttonTitle) {
            buttonTitle = RCTUIKitLocalizedString(@"Cancel");
        }
        UIAlertAction* cancelAction = [UIAlertAction actionWithTitle:buttonTitle style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
            callback(@[]);
        }];
        [cancelAction setValue:@(textAlign) forKey:@"titleTextAlignment"];
        
        [alertController addAction:cancelAction];
    }
    
    alertController.modalPresentationStyle = UIModalPresentationPopover;
    alertController.popoverPresentationController.sourceView = sourceView;
    alertController.popoverPresentationController.sourceRect = sourceRect;
    if (!anchorViewTag) {
        alertController.popoverPresentationController.permittedArrowDirections = 0;
    }
    [controller presentViewController:alertController animated:YES completion:nil];
    
    alertController.view.tintColor = [RCTConvert UIColor:options[@"tintColor"]];
}

- (nullable UIImage *)iconImageFromDictionary:(NSDictionary *)dictionary
{
  NSString *iconURLString = dictionary[@"uri"];
  if (!iconURLString) {
    return nil;
  }
  NSURL *iconURL = [NSURL URLWithString:iconURLString];
  if (!iconURL) {
    return nil;
  }
  NSData *iconData = [NSData dataWithContentsOfURL:iconURL];
  if (!iconData) {
    return nil;
  }
  return [UIImage imageWithData:iconData];
}

@end
