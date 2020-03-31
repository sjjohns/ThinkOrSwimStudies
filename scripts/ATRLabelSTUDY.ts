#
# Copyright 2014 Scott J. Johnson (https://scottjjohnson.com)
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
# ATRLabel
#
# Displays Average True Range over the last 40 periods and the current period
#
input ATRLength = 40;

# historical ATR
def ATRValue = Average(TrueRange(high,  close,  low),  ATRLength);
def ATRPercent = ATRValue / close * 100;

# current period range
def ATRLastBar = TrueRange(high,  close,  low);

AddLabel(yes, ATRLength + " Period ATR = $" + Round(ATRValue, 2) + " (" + Round(ATRPercent, 2) + "%), Current Period Range = $" + Round(ATRLastBar, 2) + " (" + Round(ATRLastBar / close * 100, 2) + "%)", CreateColor(153, 153, 0));
