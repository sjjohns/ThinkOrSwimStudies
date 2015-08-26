#
# Copyright 2015 Scott J. Johnson (http://scottjjohnson.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# 
# PocketPivot
#
# Caution: This script is a work-in-progress.  I'm tweaking the "magic numbers" to
#          minimize the number of poor pivots identified while keeping the strong ones.
#          So far I've backtested against a number of stocks in the 2014-15 timeframe
#          and the success rate is ok, but not great.  I'm having better luck with buyable 
#          gaps up and O'Neil-style base breakouts.
#
# Identifies up volume spikes that may be a buyable pocket pivot.  Based on the work
# of Gil Morales and Chris Kacher:
#
# http://www.wiley.com/WileyCDA/WileyTitle/productCd-0470616539,miniSiteCd-WILEYTRADING.html
# http://www.aaiilosangeles.org/SkirballPresentations/Morales&Kacher091110.pdf
#
# This study checks price and volume to see if they met the pocket pivot criteria. The
# other criteria (strong fundamentals, no wedging, constructive basing, etc.) need to be evaluated 
# separately. 
#
# I made these additions/modifications to Gil's and Chris's vague definition of a pocket pivot:
#
# 1. Per Gil and Chris, the volume on the day of the pocket pivot must be higher than 
#    any down day in the previous 10 days.  But if the volume is "choppy", then increase
#    the period to 11 to 15 days.  But they don't define "choppy".  For the purposes of 
#    this script, I define choppy when the standard deviation of the volume is > 125% of
#    the average.  Update: I removed the stddev logic since it didn't eliminate any obviously 
#    poor pivots.  I'm always looking at the volume on the previous 10 days.
#
# 2. Volume must be >= 100% of the 50 day average volume. I added this to eliminate a bunch
#    of what I thought were marginal pivots.  Several of Gil/Chris's examples have volume below
#    the 50-day moving average.
#
# 3. Volume must be >= 110% of the highest volume down day in the last 10 days.  Gil
#    and Chris only say volume must be greater than any down day.  Larger volume on the pivot 
#    day confirms the price move.
#
# 4. I only count the pocket pivot if the stock closes in the top half of the day's price
#    range.  Up days that close in the lower half of the range are considered stalling.
# 
# 5. Gil and Chris say daily price closes prior to the pivot should be "tight" without any
#    specifics.  I defined tight as where the average percent price change at close over
#    the last 10 days is <= 1.5%. 
# 
# 6. Closing price must be greater than open. This is to eliminate negative reversals.
#
# 7. The low on the day of the pivot must be within 2.0% of the 10-day SMA or the price must
#    have moved up through the 10-day during that day.  Several of Gil/Chris's examples are
#    very extended from the 10-day.  I'm choosing a more conservative setting here.
#
input Period = 10;  # normal volume lookback period
input MinimumVolumeVsHighestDownVolumeRatio = 1.1;  # Volume on the pivot day must be 1.1x the highest volume down day
input MinimumVolumeVsAverageVolumeRatio = 1.0;  # Volume on then pivot day must be 1.0x the 50-day average volume 
input MaximumDistanceFrom10DaySMAPercent = 2.0;  # Price on pivot day should be near the 10-day SMA. 
input MaximumAveragePercentChangeInPriceClose = 1.5; # The max average closing price percent change over the previous 10 days
input MinimumAverageDailyVolume = 500000; # average daily share volume

# Volume functions
def DownVolume = If(close <= close[1], volume, 0);
def HighestDownVolume = Highest(DownVolume, Period);

def FiftyDayAverageVolume = MovingAverage(AverageType.SIMPLE, volume, 50);

def IsVolumeGreaterHighestDownVolume = if (volume > HighestDownVolume * MinimumVolumeVsHighestDownVolumeRatio) then 1 else 0;
def IsVolumeGreaterThanAverage = if (volume >= FiftyDayAverageVolume * MinimumVolumeVsAverageVolumeRatio) then 1 else 0;
def IsAverageVolumeHigherThanMinimum = if (FiftyDayAverageVolume >= MinimumAverageDailyVolume) then 1 else 0;

def IsPivotVolumeHighEnough = if (IsVolumeGreaterHighestDownVolume && IsVolumeGreaterThanAverage && IsAverageVolumeHigherThanMinimum) then 1 else 0;

# Price functions
def TenDaySMA = MovingAverage(AverageType.SIMPLE, close, 10);
def FiftyDaySMA = MovingAverage(AverageType.SIMPLE, close, 50);
def TwoHundredDaySMA = MovingAverage(AverageType.SIMPLE, close, 200);

def IsLowPriceNear10DaySMA = if ((AbsValue(low - TenDaySMA) / TenDaySMA) <= MaximumDistanceFrom10DaySMAPercent / 100) then 1 else 0;
def DidPricePass10DaySMA = if (Min(open, low) < TenDaySMA && close >= TenDaySMA) then 1 else 0;

def IsPriceNear10DaySMA = if (IsLowPriceNear10DaySMA or DidPricePass10DaySMA) then 1 else 0;

def IsPriceAtOrAbove50And200DaySMAs = if (close >= FiftyDaySMA && close >= TwoHundredDaySMA) then 1 else 0;

def AveragePriceChangePercent = MovingAverage(AverageType.SIMPLE, AbsValue(close[1] - close[2]) / close[2], Period);
def AreClosingPricesTight = if (AveragePriceChangePercent <= MaximumAveragePercentChangeInPriceClose / 100) then 1 else 0;

def IsCloseInUpperHalfOfRange = close >= close[1] && close >= ((high - low) * .50 + low);
def IsCloseGreaterOrEqualToOpen = if (close >= open) then 1 else 0;

def IsPriceInTheProperRange = if (IsCloseInUpperHalfOfRange && IsCloseGreaterOrEqualToOpen && IsPriceNear10DaySMA && IsPriceAtOrAbove50And200DaySMAs && AreClosingPricesTight) then 1 else 0;

# add a chart bubble if then PP criteria are met
AddChartBubble(IsPivotVolumeHighEnough && IsPriceInTheProperRange, low, "PP", Color.CYAN, no);