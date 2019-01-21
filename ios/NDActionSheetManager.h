#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>

typedef NS_ENUM(NSInteger, NDActionTextAlignment) {
    NDActionTextAlignmentLeft = 0,
    NDActionTextAlignmentCenter,
    NDActionTextAlignmentRight,
};

@interface NDActionSheetManager : NSObject <RCTBridgeModule>

@end
